"use client";

import type React from "react";

import { useState } from "react";
import { Calendar, MapPin, ImageIcon, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import styles from "./create-event-form.module.css";

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
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
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
              className={styles.input}
            />
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
                    className={styles.removeImageButton}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              ) : (
                <label htmlFor="image" className={styles.uploadLabel}>
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
                className={styles.fileInput}
              />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={styles.cancelButton}
          >
            Hủy
          </Button>
          <Button type="submit" size="lg" className={styles.submitButton}>
            Tạo sự kiện
          </Button>
        </div>
      </div>
    </form>
  );
}
