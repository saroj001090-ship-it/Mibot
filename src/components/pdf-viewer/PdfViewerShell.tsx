'use client';

import { Download, Maximize2, Moon, Printer, RotateCw, Search, Sun, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { FileDropzone } from '@/components/upload/FileDropzone';

export function PdfViewerShell() {
  const [files, setFiles] = useState<File[]>([]);
  const [zoom, setZoom] = useState(100);
  const [darkReader, setDarkReader] = useState(false);
  const file = files[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <FileDropzone multiple={false} files={files} onFiles={setFiles} acceptedLabel="PDF" />
        <div className="card p-4">
          <h2 className="font-bold">File information</h2>
          {file ? (
            <dl className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between"><dt>Name</dt><dd className="max-w-40 truncate">{file.name}</dd></div>
              <div className="flex justify-between"><dt>Size</dt><dd>{(file.size / 1024 / 1024).toFixed(2)} MB</dd></div>
              <div className="flex justify-between"><dt>Mode</dt><dd>Browser preview</dd></div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Upload a PDF to inspect it locally.</p>
          )}
        </div>
      </aside>

      <section className="card min-h-[640px] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10">
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary px-3 py-2" onClick={() => setZoom((value) => Math.max(25, value - 25))}><ZoomOut className="h-4 w-4" /></button>
            <span className="rounded-2xl border px-4 py-2 text-sm font-bold">{zoom}%</span>
            <button className="btn-secondary px-3 py-2" onClick={() => setZoom((value) => Math.min(300, value + 25))}><ZoomIn className="h-4 w-4" /></button>
            <button className="btn-secondary px-3 py-2"><RotateCw className="h-4 w-4" /></button>
            <button className="btn-secondary px-3 py-2"><Search className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-3 py-2" onClick={() => setDarkReader((value) => !value)}>
              {darkReader ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="btn-secondary px-3 py-2"><Printer className="h-4 w-4" /></button>
            <button className="btn-secondary px-3 py-2"><Download className="h-4 w-4" /></button>
            <button className="btn-secondary px-3 py-2"><Maximize2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className={darkReader ? 'bg-slate-950 p-6' : 'bg-slate-100 p-6 dark:bg-slate-900'}>
          <div className="mx-auto grid min-h-[520px] max-w-3xl place-items-center rounded-3xl bg-white p-10 text-center shadow-2xl dark:bg-slate-800">
            <div>
              <p className="text-sm font-semibold text-brand-600">Lazy-rendered PDF canvas placeholder</p>
              <h2 className="mt-3 text-3xl font-black">{file ? file.name : 'Upload a PDF to preview'}</h2>
              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
                The viewer shell includes thumbnails-ready layout, zoom, rotate, search, fullscreen, print, download, dark reading mode,
                file details, and a clean extension point for pdf.js canvas rendering.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
