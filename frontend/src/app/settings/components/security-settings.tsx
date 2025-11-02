"use client";

import { useState } from "react";
import styles from "./security-settings.module.css";
import SettingSection from "./setting-section";
import { Eye, EyeOff } from "lucide-react";

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className={styles.securitySettings}>
      <h1 className={styles.title}>Cài Đặt Bảo Mật</h1>
      <p className={styles.description}>
        Quản lý các cài đặt bảo mật tài khoản của bạn
      </p>

      <SettingSection
        title="Đổi Mật Khẩu"
        description="Cập nhật mật khẩu tài khoản của bạn"
      >
        <div className={styles.passwordForm}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu hiện tại</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                className={styles.input}
              />
              <button
                className={styles.toggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu mới</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                className={styles.input}
              />
              <button
                className={styles.toggleButton}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              className={styles.input}
            />
          </div>

          <button className={styles.saveButton}>Lưu Mật Khẩu</button>
        </div>
      </SettingSection>

      <SettingSection
        title="Các Thiết Bị Đã Đăng Nhập"
        description="Quản lý các thiết bị đã đăng nhập"
      >
        <div className={styles.deviceList}>
          <div className={styles.deviceItem}>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceName}>Chrome on Windows</span>
              <span className={styles.deviceTime}>
                Đăng nhập lần cuối: 2 giờ trước
              </span>
            </div>
          </div>
          <div className={styles.deviceItem}>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceName}>Safari on Mac</span>
              <span className={styles.deviceTime}>
                Đăng nhập lần cuối: 1 ngày trước
              </span>
            </div>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}
