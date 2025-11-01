import type React from "react";
import styles from "./setting-section.module.css";

interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
