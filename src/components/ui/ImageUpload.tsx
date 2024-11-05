import React, { useState, ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect?: (file: File) => void;
  maxSizeKB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  maxSizeKB = 100,
}) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        // Convert KB to bytes
        alert(`File terlalu besar. Maksimum ukuran file adalah ${maxSizeKB}KB`);
        return;
      }

      setSelectedFile(file);
      onImageSelect?.(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Unggah Foto Pribadi
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <div className="h-24 w-24 overflow-hidden rounded-md border-2 border-gray-300">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex h-full flex-col items-start justify-around">
          <div>
            <p className="text-sm text-gray-600">
              Silakan unggah gambar berukuran kurang dari {maxSizeKB}KB
            </p>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-block cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Pilih File
            </label>
          </div>
        </div>
      </div>
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-500">
          File terpilih: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
