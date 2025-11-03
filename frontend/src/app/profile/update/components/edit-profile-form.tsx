"use client";

import { useState, useEffect } from "react";
import styles from "./edit-profile-form.module.css";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/token";
import { toastManager } from "@/components/static/toast/toast";
import { toast } from "sonner";

interface EditProfileFormProps {
  onSave: () => void;
}

interface DecodedToken {
  sub: string;
  exp?: number;
  [key: string]: unknown;
}

export default function EditProfileForm({ onSave }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded && decoded.sub) {
        setEmail(decoded.sub);
      }
    } catch (err) {
      console.error("Token decode lỗi:", err);
    }
  }, []);
  useEffect(() => {
    const token = getAccessToken();
    if (!email || !token) return;
    console.log(email);
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/user/information/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok)
          throw new Error(`Lỗi khi lấy thông tin user: ${res.status}`);
        const result = await res.json();
        if (result.status != 200) {
          toastManager.error("Có lỗi xảy ra");
        } else {
          setFormData({
            fullName: result.data.fullName || "example",
            phoneNumber: result.data.phone || "12344342423",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [email]);

  // ✅ Xử lý input thay đổi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Khi nhấn lưu
  const handleSave = async () => {
    const token = getAccessToken();
    if (!token) return alert("Chưa đăng nhập!");

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8080/api/user/update-information",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updated = await res.json();
      console.log("Đã cập nhật:", updated);

      setIsEditing(false);
      onSave();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
      {loading && <p className={styles.loadingText}>Đang tải...</p>}

      {/* Full Name */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Họ và Tên</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.fieldInput}
          />
        </div>
      </div>

      {/* Phone */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Số Điện Thoại</label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            name="phone"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.fieldInput}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.buttonGroup}>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`${styles.buttonBase} ${styles.buttonPrimary}`}
          >
            Chỉnh Sửa
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSave}
              className={`${styles.buttonBase} ${styles.buttonPrimary}`}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`${styles.buttonBase} ${styles.buttonSecondary}`}
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </form>
  );
}
