import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import styles from "./layout.module.css";

interface ActivityLayoutProps {
  activePage: string;
  onPageChange: (page: string) => void;
  children: ReactNode;
}

export default function ActivityLayout({
  activePage,
  onPageChange,
  children,
}: ActivityLayoutProps) {
  return (
    <div className={styles.container}>
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
