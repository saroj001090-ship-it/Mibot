'use client';

import { GripVertical, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { privacyNotice } from '@/lib/seo/tools';

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/plain',
  'text/html',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

const allowedExtension = /\.(pdf|jpg|jpeg|png|txt|html|docx|xlsx|pptx)$/i;
const maxFileSize = 200 * 1024 * 1024;

export type FileDropzoneProps = {
  multiple?: boolean;
  files?: File[];
  onFiles?: (files: File[]) => void;
  acceptedLabel?: string;
};

export function FileDropzone({
  multiple = true,
  files: controlledFiles,
  onFiles,
  acceptedLabel = 'PDF, JPG, PNG, TXT, HTML, DOCX, XLSX, and PPTX',
}: FileDropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const files = controlledFiles ?? internalFiles;

  function commit(nextFiles: File[]) {
    if (!controlledFiles) setInternalFiles(nextFiles);
    onFiles?.(nextFiles);
  }

  function add(fileList: FileList | null) {
    if (!fileList) return;

    const nextFiles = multiple ? [...files] : [];
    const validationErrors: string[] = [];

    for (const file of Array.from(fileList)) {
      const isAllowed = allowedMimeTypes.has(file.type) || allowedExtension.test(file.name);

      if (!isAllowed) {
        validationErrors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > maxFileSize) {
        validationErrors.push(`${file.name}: file is over 200 MB.`);
        continue;
      }

      nextFiles.push(file);
    }

    setError(validationErrors.join(' '));
    commit(nextFiles);
  }

  function removeFile(index: number) {
    commit(files.filter((_, fileIndex) => fileIndex !== index));
  }

  function moveFile(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const nextFiles = [...files];
    const [file] = nextFiles.splice(index, 1);
    nextFiles.splice(targetIndex, 0, file);
    commit(nextFiles);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          add(event.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className="card cursor-pointer border-dashed p-8 text-center transition hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-white/10"
      >
        <UploadCloud className="mx-auto mb-4 h-12 w-12 text-brand-600" />
        <h3 className="text-xl font-bold">Drag & drop files here</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Click to upload, preview, reorder, process, and download results.
        </p>
        <p className="mt-1 text-xs text-slate-500">Supported inputs: {acceptedLabel}</p>
        <p className="mt-4 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          {privacyNotice}
        </p>
        <input
          ref={input}
          className="hidden"
          type="file"
          multiple={multiple}
          onChange={(event) => add(event.target.files)}
        />
      </div>

      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {files.length > 0 ? (
        <div className="card divide-y divide-slate-100 p-2 dark:divide-white/10">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 p-3">
              <GripVertical className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="font-semibold">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • validated • ready
                </p>
              </div>
              <div className="flex gap-1 text-xs">
                <button className="rounded-lg border px-2 py-1" onClick={() => moveFile(index, -1)}>
                  Up
                </button>
                <button className="rounded-lg border px-2 py-1" onClick={() => moveFile(index, 1)}>
                  Down
                </button>
              </div>
              <button aria-label={`Remove ${file.name}`} onClick={() => removeFile(index)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
