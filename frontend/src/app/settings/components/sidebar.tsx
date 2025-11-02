"use client";

import styles from "./settings-sidebar.module.css";
import { Lock, Palette } from "lucide-react";

interface SettingsSidebarProps {
  currentPage: "security" | "ui";
  onPageChange: (page: "security" | "ui") => void;
}

export default function SettingsSidebar({
  currentPage,
  onPageChange,
}: SettingsSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.title}>Cài Đặt</h2>
      </div>

      <nav className={styles.navigation}>
        <button
          className={`${styles.navItem} ${
            currentPage === "security" ? styles.active : ""
          }`}
          onClick={() => onPageChange("security")}
        >
          <Lock size={20} />
          <span>Bảo Mật</span>
        </button>

        <button
          className={`${styles.navItem} ${
            currentPage === "ui" ? styles.active : ""
          }`}
          onClick={() => onPageChange("ui")}
        >
          <Palette size={20} />
          <span>Giao Diện</span>
        </button>
      </nav>
    </aside>
  );
}
