"use client";

import { useState } from "react";
import ActivityLayout from "./components/ActivityLayout";
import ActivityPage1 from "./components/page1";
import ActivityPage2 from "./components/page2";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
export default function Home() {
  const [activePage, setActivePage] = useState("page1");
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => router.back()}
        className={styles.backButton}
        aria-label="Quay lại"
        title="Quay lại"
      >
        ←
      </button>
      <ActivityLayout activePage={activePage} onPageChange={setActivePage}>
        {activePage === "page1" && <ActivityPage1 />}
        {activePage === "page2" && <ActivityPage2 />}
      </ActivityLayout>
    </>
  );
}
