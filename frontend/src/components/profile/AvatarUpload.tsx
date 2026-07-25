"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "@/hooks/useProfile";

interface AvatarUploadProps {
  avatar?: string;
  name?: string;
}

export default function AvatarUpload({
  avatar,
  name,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const handleSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    uploadAvatar(file, {
      onError: () => {
        URL.revokeObjectURL(previewUrl);
        setPreview(null);
      },
    });
  };

  const imageSrc = preview || avatar || "";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-muted shadow-lg">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name ?? "Profile"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-14 w-14 text-muted-foreground" />
            </div>
          )}

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            </div>
          )}
        </div>

        <Button
          type="button"
          size="icon"
          onClick={handleSelect}
          disabled={isPending}
          className="absolute bottom-1 right-1 rounded-full"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">
          Change Profile Picture
        </p>

        <p className="text-xs text-muted-foreground">
          JPG, PNG or WEBP (Max 5 MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}