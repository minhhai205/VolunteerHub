"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./filter-buttons.module.css";

type FilterType = "all" | "pending" | "approved" | "rejected";

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  pendingCount: number;
}

export function FilterButtons({
  currentFilter,
  onFilterChange,
  pendingCount,
}: FilterButtonsProps) {
  const filterButtons = [
    { value: "all" as const, label: "Tất cả" },
    { value: "pending" as const, label: `Chưa duyệt (${pendingCount})` },
    { value: "approved" as const, label: "Đã duyệt" },
    { value: "rejected" as const, label: "Đã từ chối" },
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.buttonsGroup}>
        {filterButtons.map((button) => (
          <Button
            key={button.value}
            variant={currentFilter === button.value ? "default" : "outline"}
            onClick={() => onFilterChange(button.value)}
            className={`${styles.filterButton} ${
              currentFilter === button.value
                ? styles.filterButtonActive
                : styles.filterButtonInactive
            }`}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
