"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  rounded?: "xl" | "full";
  required?: boolean;
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Image",
  hint = "JPG, PNG, WebP or GIF — max 5MB",
  rounded = "xl",
  required = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      toast.error("Please sign in again");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      onChange(data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewRounded = rounded === "full" ? "rounded-full" : "rounded-xl";

  return (
    <div>
      <label className="text-white/40 text-xs block mb-2 flex items-center gap-1">
        <ImageIcon className="w-3 h-3" />
        {label}{required ? " *" : ""}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      {value ? (
        <div className="flex items-start gap-4">
          <div className={`relative w-28 h-28 ${previewRounded} overflow-hidden border border-purple-500/30 flex-shrink-0`}>
            <Image src={value} alt="Uploaded" fill className="object-cover" unoptimized />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-white/50 text-xs break-all max-w-xs">{value}</p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Replace image
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-white/50 border border-white/10 hover:bg-red-500/10 hover:text-red-300 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-purple-500/30 bg-white/[0.03] hover:bg-purple-500/10 hover:border-purple-500/50 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-white/50 text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-300" />
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm font-medium">Choose image from folder</p>
                <p className="text-white/35 text-xs mt-1">{hint}</p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}
