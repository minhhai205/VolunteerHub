"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  index: number;
}

export default function EventRequestCard({
  request,
  index,
}: EventRequestCardProps) {
  const router = useRouter();

  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "approve":
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
      case "approve":
        return "Đã Duyệt";
      case "rejected":
        return "Từ Chối";
      default:
        return "Đang Chờ";
    }
  };

  const handleViewEventDetail = () => {
    router.push(`/event/detail/${request.eventId}`);
  };

  // Format lại ngày đăng ký
  const formatDate = (isoString: string) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.columnNumber}>
        <span className={styles.value}>{index}</span>
      </div>

      <div className={styles.columnEventName}>
        <span className={styles.value}>{request.eventName}</span>
      </div>

      <div className={styles.columnDate}>
        <span className={styles.value}>
          {formatDate(request.registeredDate)}
        </span>
      </div>

      <div className={styles.columnStatus}>
        <span
          className={`${styles.statusBadge} ${getStatusClass(request.status)}`}
        >
          {getStatusLabel(request.status)}
        </span>
      </div>

      <div className={styles.columnActions}>
        <Button
          onClick={handleViewEventDetail}
          className={styles.viewButton}
          variant="outline"
        >
          Xem Chi Tiết
        </Button>
      </div>
    </div>
  );
}
