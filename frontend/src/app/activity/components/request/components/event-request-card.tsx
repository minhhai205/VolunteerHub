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
}

export default function EventRequestCard({ request }: EventRequestCardProps) {
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