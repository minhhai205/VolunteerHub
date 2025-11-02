"use client";

import { useState } from "react";
import SettingsSidebar from "./components/sidebar";
import SecuritySettings from "./components/security-settings";
import UISettings from "./components/ui-settings";
import styles from "./components/settings.module.css";

type SettingsPage = "security" | "ui";

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState<SettingsPage>("security");

  return (
    <div className={styles.settingsContainer}>
      <SettingsSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className={styles.settingsContent}>
        {currentPage === "security" && <SecuritySettings />}
        {currentPage === "ui" && <UISettings />}
      </div>
    </div>
  );
}
