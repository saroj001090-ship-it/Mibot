export type PdfBytes = Uint8Array | ArrayBuffer;
export type ToolResult = { name: string; bytes: Uint8Array; mime: string };
export interface PdfViewerEngine { load(file: File): Promise<{ pages: number; title?: string }>; renderPage?(page: number, scale: number): Promise<HTMLCanvasElement>; }
export interface PdfMergeEngine { merge(files: File[]): Promise<ToolResult>; }
export interface PdfSplitEngine { split(file: File, ranges: string): Promise<ToolResult[]>; removePages(file: File, pages: number[]): Promise<ToolResult>; rotatePages(file: File, pages: number[], degrees: number): Promise<ToolResult>; }
export interface PdfCompressEngine { compress(file: File, options: { targetMb?: number; quality: number; preset: string }): Promise<ToolResult & { originalSize: number; finalSize: number; message?: string }>; }
export interface PdfConvertEngine { imagesToPdf(files: File[]): Promise<ToolResult>; pdfToImages(file: File, format: 'jpg'|'png'): Promise<ToolResult[]>; textToPdf(file: File): Promise<ToolResult>; }
export interface PdfEditEngine { addSignature(file: File, signatureDataUrl: string): Promise<ToolResult>; }
export interface PdfSecurityEngine { protect(file: File, password: string): Promise<ToolResult>; unlock(file: File, password: string): Promise<ToolResult>; }
export interface PdfOcrEngine { extractText(file: File, languages: string[]): Promise<{ text: string; searchablePdf?: ToolResult; requiresCloud?: boolean }>; }
export interface PdfMetadataEngine { read(file: File): Promise<Record<string,string|number|boolean>>; update(file: File, metadata: Record<string,string>): Promise<ToolResult>; }
export interface PdfBatchEngine { enqueue(files: File[], tool: string): Promise<{ id: string; status: 'queued'|'running'|'done'|'failed' }>; }
