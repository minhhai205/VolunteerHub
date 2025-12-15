"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./BulkActions.module.css";

interface BulkActionsProps {
  selectedCount: number;
  onMarkCompleted: () => void;
  onMarkAbsent: () => void;
  className?: string;
}

export default function BulkActions({
  selectedCount,
  onMarkCompleted,
  onMarkAbsent,
  className,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={`${styles.bulkActions} ${className || ""}`}>
      <span className={styles.selectedText}>Đã chọn {selectedCount} người</span>
      <Button
        size="sm"
        onClick={onMarkCompleted}
        className={styles.completeButton}
      >
        <CheckCircle2 className="w-4 h-4" />
        Đánh dấu hoàn thành
      </Button>
      <Button size="sm" onClick={onMarkAbsent} className={styles.absentButton}>
        <XCircle className="w-4 h-4" />
        Đánh dấu vắng mặt
      </Button>
    </div>
  );
}
