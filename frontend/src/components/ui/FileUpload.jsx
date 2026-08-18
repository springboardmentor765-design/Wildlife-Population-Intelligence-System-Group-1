import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, FileCheck2 } from 'lucide-react';
import { clsx } from '../../utils/cn';
import { Button } from './Button';

/**
 * Drag-and-drop uploader. Calls onUpload(files, setProgress) and reports
 * progress through the parent-supplied handler.
 */
export function FileUpload({
  accept = 'image/*',
  multiple = true,
  hint = 'JPG or PNG, up to 25 MB each',
  label = 'Drop camera trap images here',
  onUpload,
  uploading = false,
  progress = 0,
}) {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState([]);
  const inputRef = useRef(null);

  const addFiles = useCallback(
    (list) => {
      const files = Array.from(list || []);
      if (!files.length) return;
      setQueue((q) => (multiple ? [...q, ...files] : files.slice(0, 1)));
    },
    [multiple]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const start = async () => {
    if (!queue.length) return;
    await onUpload?.(queue);
    setQueue([]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' ? inputRef.current?.click() : null)}
        role="button"
        tabIndex={0}
        className={clsx(
          'rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition',
          dragging
            ? 'border-moss-400 bg-moss-50'
            : 'border-sand-300 bg-sand-50 hover:border-moss-300 hover:bg-moss-50/40'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white text-moss-500 mx-auto shadow-sm">
          <UploadCloud size={22} />
        </span>
        <p className="mt-3 font-medium text-ink-900">{label}</p>
        <p className="text-sm text-ink-500 mt-1">
          or <span className="text-moss-600 font-medium">browse your files</span> · {hint}
        </p>
      </div>

      {queue.length > 0 && (
        <ul className="mt-4 space-y-2">
          {queue.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-sand-200 bg-white px-3 py-2.5"
            >
              <FileCheck2 size={16} className="text-moss-500 shrink-0" />
              <span className="text-sm text-ink-700 truncate flex-1">{f.name}</span>
              <span className="text-xs text-ink-500 tabular-nums">
                {(f.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                onClick={() => setQueue((q) => q.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${f.name}`}
                className="p-1 rounded text-ink-500 hover:text-red-600 hover:bg-red-50"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-ink-500 mb-1.5">
            <span>Analysing upload…</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-sand-200 overflow-hidden">
            <div
              className="h-full bg-moss-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {queue.length > 0 && !uploading && (
        <div className="mt-4 flex gap-3">
          <Button onClick={start} icon={UploadCloud}>
            Upload {queue.length} file{queue.length > 1 ? 's' : ''}
          </Button>
          <Button variant="ghost" onClick={() => setQueue([])}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
