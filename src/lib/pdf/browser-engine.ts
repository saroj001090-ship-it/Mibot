'use client';

import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type {
  PdfCompressEngine,
  PdfConvertEngine,
  PdfMergeEngine,
  PdfMetadataEngine,
  PdfSplitEngine,
  ToolResult,
} from './types';

const pdfMime = 'application/pdf';
const bytesFromFile = async (file: File) => new Uint8Array(await file.arrayBuffer());
const withSuffix = (file: File, suffix: string) => file.name.replace(/\.[^.]+$/, '') + suffix;

function pageRangeToIndexes(range: string, totalPages: number) {
  const indexes = new Set<number>();

  for (const rawPart of range.split(',')) {
    const part = rawPart.trim();
    if (!part) continue;

    const [startText, endText] = part.split('-');
    const start = Math.max(1, Number(startText) || 1);
    const end = Math.min(totalPages, Number(endText) || start);

    for (let page = start; page <= end; page += 1) indexes.add(page - 1);
  }

  return [...indexes].sort((left, right) => left - right);
}

export class BrowserPdfEngine
  implements PdfMergeEngine, PdfSplitEngine, PdfCompressEngine, PdfConvertEngine, PdfMetadataEngine
{
  async merge(files: File[]): Promise<ToolResult> {
    const outputDocument = await PDFDocument.create();

    for (const file of files) {
      const sourceDocument = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
      const copiedPages = await outputDocument.copyPages(sourceDocument, sourceDocument.getPageIndices());
      copiedPages.forEach((page) => outputDocument.addPage(page));
    }

    return { name: 'merged-docuflux.pdf', bytes: await outputDocument.save(), mime: pdfMime };
  }

  async split(file: File, ranges: string): Promise<ToolResult[]> {
    const sourceDocument = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
    const totalPages = sourceDocument.getPageCount();
    const rangeGroups = ranges.split(',').map((range) => range.trim()).filter(Boolean);
    const results: ToolResult[] = [];

    for (const rangeGroup of rangeGroups) {
      const pageIndexes = pageRangeToIndexes(rangeGroup, totalPages);
      if (!pageIndexes.length) continue;

      const outputDocument = await PDFDocument.create();
      const copiedPages = await outputDocument.copyPages(sourceDocument, pageIndexes);
      copiedPages.forEach((page) => outputDocument.addPage(page));
      results.push({
        name: withSuffix(file, `-pages-${rangeGroup.replace(/[^0-9-]/g, '-')}.pdf`),
        bytes: await outputDocument.save(),
        mime: pdfMime,
      });
    }

    return results;
  }

  async removePages(file: File, pages: number[]): Promise<ToolResult> {
    const sourceDocument = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
    const keepIndexes = sourceDocument.getPageIndices().filter((pageIndex) => !pages.includes(pageIndex + 1));
    const outputDocument = await PDFDocument.create();
    const copiedPages = await outputDocument.copyPages(sourceDocument, keepIndexes);
    copiedPages.forEach((page) => outputDocument.addPage(page));

    return { name: withSuffix(file, '-removed-pages.pdf'), bytes: await outputDocument.save(), mime: pdfMime };
  }

  async rotatePages(file: File, pages: number[], rotationDegrees: number): Promise<ToolResult> {
    const document = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
    document.getPages().forEach((page, index) => {
      if (!pages.length || pages.includes(index + 1)) page.setRotation(degrees(rotationDegrees));
    });

    return { name: withSuffix(file, '-rotated.pdf'), bytes: await document.save(), mime: pdfMime };
  }

  async compress(file: File, options: { targetMb?: number; quality: number; preset: string }) {
    const document = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
    document.setProducer('DocuFlux PDF browser engine');
    document.setCreator('DocuFlux PDF');

    const saved = await document.save({ useObjectStreams: true, addDefaultPage: false });
    const targetBytes = (options.targetMb || 0) * 1024 * 1024;
    const message =
      targetBytes && file.size < targetBytes
        ? 'This PDF is already under your selected size. Browser compression optimized metadata/resources where possible.'
        : undefined;

    return {
      name: withSuffix(file, '-compressed.pdf'),
      bytes: saved,
      mime: pdfMime,
      originalSize: file.size,
      finalSize: saved.byteLength,
      message,
    };
  }

  async imagesToPdf(files: File[]): Promise<ToolResult> {
    const document = await PDFDocument.create();

    for (const file of files) {
      const imageBytes = await bytesFromFile(file);
      const image = file.type.includes('png') ? await document.embedPng(imageBytes) : await document.embedJpg(imageBytes);
      const page = document.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    return { name: 'images-docuflux.pdf', bytes: await document.save(), mime: pdfMime };
  }

  async pdfToImages(): Promise<ToolResult[]> {
    throw new Error('PDF to image uses the lazy pdf.js renderer in the browser viewer.');
  }

  async textToPdf(file: File): Promise<ToolResult> {
    const document = await PDFDocument.create();
    const font = await document.embedFont(StandardFonts.Helvetica);
    const text = await file.text();
    let page = document.addPage();
    let y = 760;

    for (const line of text.split('\n')) {
      if (y < 48) {
        page = document.addPage();
        y = 760;
      }

      page.drawText(line.slice(0, 100), { x: 48, y, size: 11, font, color: rgb(0.05, 0.09, 0.16) });
      y -= 16;
    }

    return { name: withSuffix(file, '.pdf'), bytes: await document.save(), mime: pdfMime };
  }

  async read(file: File) {
    const document = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });

    return {
      title: document.getTitle() || '',
      author: document.getAuthor() || '',
      pageCount: document.getPageCount(),
      fileSize: file.size,
      encrypted: false,
    };
  }

  async update(file: File, metadata: Record<string, string>) {
    const document = await PDFDocument.load(await bytesFromFile(file), { ignoreEncryption: true });
    if (metadata.title) document.setTitle(metadata.title);
    if (metadata.author) document.setAuthor(metadata.author);

    return { name: withSuffix(file, '-metadata.pdf'), bytes: await document.save(), mime: pdfMime };
  }
}

export const browserPdfEngine = new BrowserPdfEngine();
