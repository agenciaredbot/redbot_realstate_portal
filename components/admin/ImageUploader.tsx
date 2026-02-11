'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, GripVertical, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir imagen');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (fileArray.length > remainingSlots) {
        setError(`Solo puedes subir ${remainingSlots} imagen(es) más`);
        return;
      }

      // Validate files
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setError('Solo se permiten archivos de imagen');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          setError('Las imágenes deben ser menores a 5MB');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      const newUrls: string[] = [];
      const total = validFiles.length;

      for (let i = 0; i < validFiles.length; i++) {
        try {
          const url = await uploadImage(validFiles[i]);
          if (url) {
            newUrls.push(url);
          }
          setUploadProgress(Math.round(((i + 1) / total) * 100));
        } catch (err) {
          console.error('Error uploading file:', err);
          setError(`Error al subir ${validFiles[i].name}`);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }

      setIsUploading(false);
      setUploadProgress(0);
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, isUploading, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    },
    [images, onChange]
  );

  const moveImage = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= images.length) return;

      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      onChange(newImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || isUploading || images.length >= maxImages}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
            <p className="text-sm text-gray-600">Subiendo... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {images.length >= maxImages
                ? `Máximo de ${maxImages} imágenes alcanzado`
                : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, WEBP (máx. 5MB cada una)
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-auto p-1"
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Imágenes ({images.length}/{maxImages})
          </p>
          <p className="text-xs text-gray-500">
            La primera imagen será la imagen principal
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((url, index) => (
              <div
                key={url}
                className={cn(
                  'relative group aspect-square rounded-lg overflow-hidden border-2',
                  index === 0 ? 'border-primary' : 'border-gray-200'
                )}
              >
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                {/* Overlay with controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Move buttons */}
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      disabled={disabled}
                    >
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                  )}

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Badge for main image */}
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
