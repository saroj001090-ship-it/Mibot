import { PdfViewerShell } from '@/components/pdf-viewer/PdfViewerShell';

export const metadata = {
  title: 'PDF Viewer',
  description: 'Fast browser PDF viewer with thumbnails, zoom, rotate, search, dark mode, print, and share.',
};

export default function Page() {
  return (
    <div className="container-page py-12">
      <span className="badge">Browser-first PDF viewer</span>
      <h1 className="mt-4 text-5xl font-black">PDF Viewer</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
        Preview PDF files locally with a performance-focused interface designed for lazy page rendering, keyboard shortcuts, thumbnails,
        search, zoom, print, and mobile gestures.
      </p>
      <div className="mt-8">
        <PdfViewerShell />
      </div>
    </div>
  );
}
