"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import styles from "./post-form.module.css";
import type { PostMedia } from "../../../../hooks/useDetail";
import { uploadToCloudinary } from "@/lib/upload";

interface PostFormProps {
  onSubmit: (content: string, medias?: string[]) => void;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedImages, ...files].slice(0, 5); // Max 5 images
    setSelectedImages(newFiles);

    // Create preview URLs
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      // Upload từng ảnh lên Cloudinary song song
      const uploadedUrls = await Promise.all(
        selectedImages.map((file) => uploadToCloudinary(file))
      );

      // Tạo mảng PostMedia từ URL thực tế
      const medias: string[] = uploadedUrls;
      // Gọi callback cha để tạo bài viết thật
      await onSubmit(content, medias);

      // Reset form sau khi gửi thành công
      setContent("");
      setSelectedImages([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Lỗi khi gửi bài viết:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span>A</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ suy nghĩ của bạn..."
          className={styles.textarea}
          rows={3}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className={styles.imagePreview}>
          {previewUrls.map((url, idx) => (
            <div key={idx} className={styles.imageItem}>
              <img src={url || "/placeholder.svg"} alt={`Preview ${idx}`} />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className={styles.removeBtn}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className={styles.fileInput}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles.imageBtn}
          disabled={selectedImages.length >= 5}
        >
          <ImageIcon size={20} />
          <span>Thêm ảnh</span>
        </button>

        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className={styles.submitBtn}
        >
          {isLoading ? (
            <span>Đang gửi...</span>
          ) : (
            <>
              <Send size={18} />
              <span>Gửi bài viết</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
