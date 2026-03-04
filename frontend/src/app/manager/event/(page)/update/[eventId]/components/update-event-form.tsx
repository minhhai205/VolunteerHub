"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  ImageIcon,
  FileText,
  Clock,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import styles from "./update-event-form.module.css";
import { uploadToCloudinary } from "@/lib/upload";
import { getAccessToken } from "@/lib/token";
import { toastManager } from "@/components/static/toast/toast";

export function UpdateEventForm({ eventId }: { eventId: string }) {
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
  const [fetchingEvent, setFetchingEvent] = useState(true);
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

  // --- FETCH EVENT DATA KHI COMPONENT MOUNT ---
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        setFetchingEvent(false);
        return;
      }

      try {
        const token = getAccessToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Không thể tải thông tin sự kiện: ${response.statusText}`,
          );
        }

        const jsObject = await response.json();
        const eventData = jsObject.data;
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);

        const formatDate = (date: Date) => {
          return date.toISOString().split("T")[0];
        };

        const formatTime = (date: Date) => {
          return date.toTimeString().slice(0, 5);
        };
        const categoryNames =
          eventData.categories?.map(
            (cat: { name: string; description: string }) => cat.name,
          ) || [];

        setFormData({
          name: eventData.name || "",
          description: eventData.description || "",
          location: eventData.location || "",
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          startTime: formatTime(startDate),
          endTime: formatTime(endDate),
          image: null,
          categories: categoryNames,
        });

        // Set image preview nếu có imageUrl
        if (eventData.imageUrl) {
          setImagePreview(eventData.imageUrl);
        }
      } catch (err) {
        console.error("Lỗi khi tải sự kiện:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin sự kiện",
        );
      } finally {
        setFetchingEvent(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // --- Validation ---
    // Chỉ yêu cầu upload ảnh mới nếu chưa có imagePreview
    if (!imagePreview && !formData.image) {
      setError("Vui lòng tải lên hình ảnh sự kiện.");
      return;
    }
    if (formData.categories.length === 0) {
      setError("Vui lòng chọn ít nhất một danh mục.");
      return;
    }

    setLoading(true);

    try {
      // Chỉ upload ảnh mới nếu user đã chọn file mới
      let imageUrl = imagePreview; // Giữ URL cũ nếu không có ảnh mới
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const startDateISO = new Date(
        `${formData.startDate}T${formData.startTime}`,
      ).toISOString();
      const endDateISO = new Date(
        `${formData.endDate}T${formData.endTime}`,
      ).toISOString();

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

      // Sử dụng PUT method và endpoint update
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/update/${eventId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(apiPayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Lỗi từ server: ${response.statusText}`,
        );
      }

      const result = await response.json();
      console.log(result);
      if (result.status !== 200) {
        toastManager.error("Đã có lỗi xảy ra, hãy thử lại");
      } else {
        toastManager.success("Cập nhật thông tin sự kiện thành công");
      }
      // Có thể thêm success notification hoặc redirect ở đây
    } catch (err) {
      console.error("Lỗi khi cập nhật sự kiện:", err);
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
    <>
      {/* --- LOADING STATE KHI ĐANG FETCH --- */}
      {fetchingEvent ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Đang tải thông tin sự kiện...</p>
        </div>
      ) : (
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
                      <span className={styles.uploadText}>
                        Nhấn để chọn ảnh
                      </span>
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
                {loading ? "Đang xử lý..." : "Cập nhật sự kiện"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
