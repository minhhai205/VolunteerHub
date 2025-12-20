"use client";

import { StatsCard } from "./stats-card";
import { FilterButtons } from "./filter-buttons";
import styles from "./event-requests-page.module.css";

type FilterType = "all" | "pending" | "approved" | "rejected";

interface EventRequestHeaderProps {
  totalCount: number;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  pendingCount: number;
}

export function EventRequestHeader({
  totalCount,
  currentFilter,
  onFilterChange,
  pendingCount,
}: EventRequestHeaderProps) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Các yêu cầu tạo sự kiện của tôi</h1>
            <p>Theo dõi trạng thái các yêu cầu tạo sự kiện đã gửi</p>
          </div>
          <StatsCard label="Tổng đơn" count={totalCount} />
        </div>
      </div>

      <FilterButtons
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        pendingCount={pendingCount}
      />
    </>
  );
}
