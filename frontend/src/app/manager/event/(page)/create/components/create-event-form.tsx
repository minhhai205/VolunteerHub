"use client";

import type React from "react";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  ImageIcon,
  FileText,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import styles from "./create-event-form.module.css";
import { uploadToCloudinary } from "@/lib/upload";
import { getAccessToken } from "@/lib/token";
import { toastManager } from "@/components/static/toast/toast";

export function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    image: null as File | null,
    categories: [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    "Giáo dục",
    "Môi trường",
    "Y tế",
    "Cộng đồng",
    "Thể thao",
    "Văn hóa",
    "Kỹ năng",
    "Khác",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (logic không đổi)
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (category: string) => {
    // ... (logic không đổi)
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  // --- HÀM SUBMIT ĐÃ CẬP NHẬT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- 1. Validation (không đổi) ---
    if (!formData.image) {
      setError("Vui lòng tải lên hình ảnh sự kiện.");
      return;
    }
    if (formData.categories.length === 0) {
      setError("Vui lòng chọn ít nhất một danh mục.");
      return;
    }

    // --- 2. DATE VALIDATION ---
    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime < startDateTime) {
      toastManager.error("Ngày kết thúc không được trước ngày bắt đầu.");
      return;
    }

    if (startDateTime > endDateTime) {
      toastManager.error("Ngày bắt đầu không được sau ngày kết thúc.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(formData.image);
      const startDateISO = startDateTime.toISOString();
      const endDateISO = endDateTime.toISOString();

      const apiPayload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        imageUrl: imageUrl,
        startDate: startDateISO,
        endDate: endDateISO,
        categoryNames: formData.categories,
      };

      const token = getAccessToken();

      const response = await fetch(
        "http://localhost:8080/api/event-request/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(apiPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Lỗi từ server: ${response.statusText}`
        );
      }

      // --- SUCCESS TOAST ---
      toastManager.success("Gửi yêu cầu tạo sự kiện thành công");

      setFormData({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        image: null,
        categories: [],
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Lỗi khi tạo sự kiện:", err);
      let errorMessage = "Đã có lỗi không xác định xảy ra.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông tin cơ bản</h2>

          <div className={styles.field}>
            <Label htmlFor="name" className={styles.label}>
              <FileText className={styles.labelIcon} />
              Tên sự kiện
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ví dụ: Chiến dịch Mùa hè xanh 2025"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="description" className={styles.label}>
              <FileText className={styles.labelIcon} />
              Mô tả sự kiện
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về mục đích, hoạt động và ý nghĩa của sự kiện..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={loading}
              rows={6}
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="location" className={styles.label}>
              <MapPin className={styles.labelIcon} />
              Địa điểm
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Ví dụ: Trường Tiểu học Xuân Đỉnh, Bắc Từ Liêm, Hà Nội"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <Label className={styles.label}>
              <Tag className={styles.labelIcon} />
              Danh mục sự kiện
            </Label>
            <div className={styles.categoryGrid}>
              {categoryOptions.map((category) => (
                <label key={category} className={styles.categoryCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    disabled={loading}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thời gian</h2>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <Label htmlFor="startDate" className={styles.label}>
                <Calendar className={styles.labelIcon} />
                Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="startTime" className={styles.label}>
                <Clock className={styles.labelIcon} />
                Giờ bắt đầu
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
                disabled={loading}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <Label htmlFor="endDate" className={styles.label}>
                <Calendar className={styles.labelIcon} />
                Ngày kết thúc
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="endTime" className={styles.label}>
                <Clock className={styles.labelIcon} />
                Giờ kết thúc
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
                disabled={loading}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Hình ảnh sự kiện</h2>

          <div className={styles.field}>
            <Label htmlFor="image" className={styles.label}>
              <ImageIcon className={styles.labelIcon} />
              Tải lên hình ảnh đại diện
            </Label>

            <div className={styles.imageUpload}>
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className={styles.imagePreview}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                    disabled={loading}
                    className={styles.removeImageButton}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className={`${styles.uploadLabel} ${
                    loading ? styles.disabledUpload : ""
                  }`}
                >
                  <ImageIcon className={styles.uploadIcon} />
                  <span className={styles.uploadText}>Nhấn để chọn ảnh</span>
                  <span className={styles.uploadHint}>
                    PNG, JPG hoặc WEBP (tối đa 5MB)
                  </span>
                </label>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className={styles.fileInput}
              />
            </div>
          </div>
        </div>

        {/* --- HIỂN THỊ LỖI --- */}
        {error && (
          <div className={styles.errorContainer}>
            <AlertCircle className={styles.errorIcon} />
            <span className={styles.errorText}>{error}</span>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={loading}
            className={styles.cancelButton}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </Button>
        </div>
      </div>
    </form>
  );
}
