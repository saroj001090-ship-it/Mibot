'use client';

import { Download, Loader2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { browserPdfEngine } from '@/lib/pdf/browser-engine';
import type { ToolResult } from '@/lib/pdf/types';
import { friendlyPdfError } from '@/lib/security/validation';
import { FileDropzone } from '@/components/upload/FileDropzone';

type ToolWorkbenchProps = {
  slug: string;
  name: string;
};

function downloadResult(result: ToolResult) {
  const blob = new Blob([result.bytes], { type: result.mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = result.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function parsePages(value: string) {
  return value
    .split(',')
    .map((page) => Number(page.trim()))
    .filter((page) => Number.isInteger(page) && page > 0);
}

export function ToolWorkbench({ slug, name }: ToolWorkbenchProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [pageRanges, setPageRanges] = useState('1-1');
  const [selectedPages, setSelectedPages] = useState('1');
  const [targetMb, setTargetMb] = useState('10');
  const [results, setResults] = useState<ToolResult[]>([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canProcess = useMemo(() => files.length > 0 && !isProcessing, [files.length, isProcessing]);

  async function processTool() {
    if (!files.length) {
      setMessage('Choose at least one file first.');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing locally in your browser...');
    setResults([]);

    try {
      let nextResults: ToolResult[] = [];

      if (slug === 'merge-pdf') {
        nextResults = [await browserPdfEngine.merge(files)];
      } else if (slug === 'split-pdf' || slug === 'extract-pdf-pages') {
        nextResults = await browserPdfEngine.split(files[0], pageRanges);
      } else if (slug === 'remove-pdf-pages') {
        nextResults = [await browserPdfEngine.removePages(files[0], parsePages(selectedPages))];
      } else if (slug === 'rotate-pdf') {
        nextResults = [await browserPdfEngine.rotatePages(files[0], parsePages(selectedPages), 90)];
      } else if (slug === 'compress-pdf') {
        const compressed = await browserPdfEngine.compress(files[0], {
          preset: `${targetMb}mb`,
          quality: 0.72,
          targetMb: Number(targetMb),
        });
        nextResults = [compressed];
        if (compressed.message) setMessage(compressed.message);
      } else if (['image-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(slug)) {
        nextResults = [await browserPdfEngine.imagesToPdf(files)];
      } else if (slug === 'txt-to-pdf') {
        nextResults = [await browserPdfEngine.textToPdf(files[0])];
      } else if (slug === 'pdf-metadata') {
        const metadata = await browserPdfEngine.read(files[0]);
        setMessage(
          `Metadata read locally: ${metadata.pageCount} pages, ${(Number(metadata.fileSize) / 1024 / 1024).toFixed(2)} MB.`,
        );
        nextResults = [];
      } else {
        setMessage(
          'This tool UI is ready. Advanced processing is intentionally gated behind explicit cloud-consent architecture before any upload can happen.',
        );
        return;
      }

      setResults(nextResults);
      if (nextResults.length) setMessage(`Done. Generated ${nextResults.length} result file(s).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : friendlyPdfError('unknown'));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone files={files} onFiles={setFiles} />

      <div className="card p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-emerald-500" />
          <div>
            <h2 className="text-xl font-bold">Local processing controls</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Supported MVP operations run in this tab. Cloud-only tools show consent messaging and do not upload files silently.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-semibold">
            Page ranges
            <input className="input mt-2" value={pageRanges} onChange={(event) => setPageRanges(event.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Selected pages
            <input className="input mt-2" value={selectedPages} onChange={(event) => setSelectedPages(event.target.value)} />
          </label>
          <label className="block text-sm font-semibold">
            Compression target MB
            <select className="input mt-2" value={targetMb} onChange={(event) => setTargetMb(event.target.value)}>
              <option value="5">5 MB</option>
              <option value="10">10 MB</option>
              <option value="15">15 MB</option>
              <option value="25">Custom: 25 MB</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" disabled={!canProcess} onClick={processTool}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Process {name}
          </button>
          <button className="btn-secondary" type="button">
            Continue with Cloud Processing
          </button>
        </div>

        {message ? <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700">{message}</p> : null}
      </div>

      {results.length ? (
        <div className="card p-6">
          <h2 className="text-xl font-bold">Results</h2>
          <div className="mt-4 grid gap-3">
            {results.map((result) => (
              <button
                key={result.name}
                onClick={() => downloadResult(result)}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-brand-400 dark:border-white/10"
              >
                <span>
                  <strong>{result.name}</strong>
                  <span className="block text-xs text-slate-500">{(result.bytes.byteLength / 1024 / 1024).toFixed(2)} MB</span>
                </span>
                <Download className="h-5 w-5 text-brand-600" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
