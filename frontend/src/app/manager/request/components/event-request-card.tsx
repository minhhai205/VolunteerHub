"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
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
  const formatRegisteredDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return styles.statusApproved;
      case "rejected":
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approved":
        return "Đã Duyệt";
      case "rejected":
        return "Từ Chối";
      default:
        return "Đang Chờ";
    }
  };

  const isProcessed = request.status.toLowerCase() !== "pending";
  console.log(request.status);

  return (
    <div className={styles.card}>
      <div className={styles.columnUserName}>
        <span className={styles.value}>{request.userName}</span>
      </div>

      <div className={styles.columnEmail}>
        <span className={styles.value}>{request.userEmail}</span>
      </div>

      <div className={styles.columnEventId}>
        <span className={styles.value}>{request.eventId}</span>
      </div>

      <div className={styles.columnEventName}>
        <span className={styles.value}>{request.eventName}</span>
      </div>

      <div className={styles.columnDate}>
        <span className={styles.value}>
          {formatRegisteredDate(request.registeredDate)}
        </span>
      </div>

      <div className={styles.columnStatus}>
        <span
          className={`${styles.statusBadge} ${getStatusClass(request.status)}`}
        >
          {request.status.toLowerCase() === "approved" && (
            <CheckCircle2 size={12} style={{ marginRight: 4 }} />
          )}
          {request.status.toLowerCase() === "pending" && (
            <Clock size={12} style={{ marginRight: 4 }} />
          )}
          {request.status.toLowerCase() === "rejected" && (
            <XCircle size={12} style={{ marginRight: 4 }} />
          )}
          {getStatusLabel(request.status)}
        </span>
      </div>

      <div className={styles.columnActions}>
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
