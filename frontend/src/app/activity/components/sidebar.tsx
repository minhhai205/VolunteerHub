"use client";

import styles from "./sidebar.module.css";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logo}>Hoạt Động</h2>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${
            activePage === "page1" ? styles.active : ""
          }`}
          onClick={() => onPageChange("page1")}
        >
          <span className={styles.navIcon}>📋</span>
          <span className={styles.navLabel}>Hoạt Động Của Tôi</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activePage === "page2" ? styles.active : ""
          }`}
          onClick={() => onPageChange("page2")}
        >
          <span className={styles.navIcon}>🏆</span>
          <span className={styles.navLabel}>Yêu cầu của tôi</span>
        </button>
      </nav>

      <div className={styles.sidebarFooter}>
        <p>Nền Tảng Tình Nguyện</p>
      </div>
    </aside>
  );
}
