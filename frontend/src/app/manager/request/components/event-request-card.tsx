"use client";

import { Button } from "@/components/ui/button";
import styles from "./styles/event-request-card.module.css";

interface Request {
  id: number;
  userName: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  registeredDate: string;
  status: string;
}

interface EventRequestCardProps {
  request: Request;
  onApprove: () => void;
  onReject: () => void;
}

export default function EventRequestCard({
  request,
  onApprove,
  onReject,
}: EventRequestCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã Duyệt";
      case "rejected":
        return "Từ Chối";
      default:
        return "Đang Chờ";
    }
  };

  const isProcessed = request.status !== "pending";

  return (
    <div className={styles.card}>
      <div className={styles.columnUserName}>
        <span className={styles.label}>Người Đăng Ký</span>
        <span className={styles.value}>{request.userName}</span>
      </div>

      <div className={styles.columnEmail}>
        <span className={styles.label}>Email</span>
        <span className={styles.value}>{request.userEmail}</span>
      </div>

      <div className={styles.columnEventId}>
        <span className={styles.label}>ID Sự Kiện</span>
        <span className={styles.value}>{request.eventId}</span>
      </div>

      <div className={styles.columnEventName}>
        <span className={styles.label}>Tên Sự Kiện</span>
        <span className={styles.value}>{request.eventName}</span>
      </div>

      <div className={styles.columnDate}>
        <span className={styles.label}>Ngày Đăng Ký</span>
        <span className={styles.value}>{request.registeredDate}</span>
      </div>

      <div className={styles.columnStatus}>
        <span className={styles.label}>Trạng Thái</span>
        <span
          className={`${styles.statusBadge} ${getStatusClass(request.status)}`}
        >
          {getStatusLabel(request.status)}
        </span>
      </div>

      <div className={styles.columnActions}>
        <span className={styles.label}>Hành Động</span>
        <div className={styles.actionButtons}>
          <Button
            onClick={onApprove}
            disabled={isProcessed}
            className={styles.approveButton}
            size="sm"
          >
            Duyệt
          </Button>
          <Button
            onClick={onReject}
            disabled={isProcessed}
            variant="outline"
            className={styles.rejectButton}
            size="sm"
          >
            Từ Chối
          </Button>
        </div>
      </div>
    </div>
  );
}
