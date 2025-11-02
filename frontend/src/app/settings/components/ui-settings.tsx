"use client";

import { useState } from "react";
import styles from "./ui-settings.module.css";
import SettingSection from "./setting-section";

export default function UISettings() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("vi");

  return (
    <div className={styles.uiSettings}>
      <h1 className={styles.title}>Cài Đặt Giao Diện</h1>
      <p className={styles.description}>
        Tuỳ chỉnh giao diện ứng dụng theo sở thích của bạn
      </p>

      <SettingSection title="Chủ Đề" description="Chọn chủ đề cho giao diện">
        <div className={styles.themeOptions}>
          {["light", "dark", "auto"].map((themeOption) => (
            <label key={themeOption} className={styles.radioOption}>
              <input
                type="radio"
                name="theme"
                value={themeOption}
                checked={theme === themeOption}
                onChange={(e) => setTheme(e.target.value)}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>
                {themeOption === "light" && "Sáng"}
                {themeOption === "dark" && "Tối"}
                {themeOption === "auto" && "Tự động"}
              </span>
            </label>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Ngôn Ngữ" description="Chọn ngôn ngữ cho ứng dụng">
        <div className={styles.selectWrapper}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.select}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </SettingSection>

      <SettingSection title="Thông Báo" description="Quản lý cài đặt thông báo">
        <div className={styles.notificationOptions}>
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <span className={styles.notificationTitle}>Thông báo Email</span>
              <span className={styles.notificationDesc}>
                Nhận thông báo qua email
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                defaultChecked
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <span className={styles.notificationTitle}>Thông báo Đẩy</span>
              <span className={styles.notificationDesc}>
                Nhận thông báo đẩy trên thiết bị
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                defaultChecked
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </SettingSection>

      <div className={styles.saveContainer}>
        <button className={styles.saveButton}>Lưu Cài Đặt</button>
      </div>
    </div>
  );
}
