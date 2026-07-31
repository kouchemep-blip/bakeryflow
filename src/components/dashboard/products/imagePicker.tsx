"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

type ImagePickerProps = {
  onChange: (file: File | null) => void;
  initialImage?: string;
};

export default function ImagePicker({
  onChange,
  initialImage,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(
    initialImage ?? ""
  );

  function handleChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange(file);

    const url = URL.createObjectURL(file);

    setPreview(url);
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
      />

      {preview && (
        <div className="relative h-48 w-48 overflow-hidden rounded-xl border">
          <Image
            src={preview}
            alt="Aperçu"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}