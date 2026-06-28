"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  name: string;
  size: number;
}

interface UploadDropzoneProps {
  multiple?: boolean;
  accept?: string;
  onFiles?: (files: UploadedFile[]) => void;
  files?: UploadedFile[];
  onRemove?: (index: number) => void;
  label?: string;
}

export function UploadDropzone({
  multiple = false,
  accept = ".pdf",
  onFiles,
  files = [],
  onRemove,
  label = "Drop a PDF here, or click to browse",
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const next: UploadedFile[] = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
      onFiles?.(next);
    },
    [onFiles],
  );

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 px-6 py-10 text-center transition-colors",
          dragging ? "border-primary bg-accent/50" : "border-input hover:border-primary/40",
        )}
      >
        <Upload className="h-7 w-7 text-muted-foreground" />
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">PDF only · up to 25 MB each</div>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-[11px] text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
              {onRemove && (
                <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(i)} aria-label="Remove">
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
