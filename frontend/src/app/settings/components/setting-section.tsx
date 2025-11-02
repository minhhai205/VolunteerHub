import type React from "react";
import styles from "./setting-section.module.css";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div className={styles.section}>
      <button
        onClick={() => router.back()}
        className={styles.backButton}
        aria-label="Quay lại"
        title="Quay lại"
      >
        ←
      </button>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
