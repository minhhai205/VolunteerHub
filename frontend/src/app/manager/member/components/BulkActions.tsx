"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./BulkActions.module.css";

interface BulkActionsProps {
  selectedCount: number;
  onMarkCompleted: () => void;
  onMarkAbsent: () => void;
}

export default function BulkActions({
  selectedCount,
  onMarkCompleted,
  onMarkAbsent,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkActions}>
      <span className={styles.selectedText}>Đã chọn {selectedCount} người</span>
      <Button
        size="sm"
        variant="outline"
        onClick={onMarkCompleted}
        className={styles.actionButton}
      >
        <CheckCircle2 className="w-4 h-4" />
        Đánh dấu hoàn thành
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onMarkAbsent}
        className={styles.actionButton}
      >
        <XCircle className="w-4 h-4" />
        Đánh dấu vắng mặt
      </Button>
    </div>
  );
}
