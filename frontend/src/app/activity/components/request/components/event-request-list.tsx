"use client";

import EventRequestCard from "./event-request-card";
import styles from "./styles/event-request-list.module.css";

export interface Request {
  id: number;
  userName: string;
  userEmail: string;
  eventId: string;
  eventName: string;
  registeredDate: string;
  status: string;
}

interface EventRequestListProps {
  requests: Request[];
}

export default function EventRequestList({ requests }: EventRequestListProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.columnUserName}>Tên Người Đăng Ký</div>
        <div className={styles.columnEmail}>Email</div>
        <div className={styles.columnEventId}>ID Sự Kiện</div>
        <div className={styles.columnEventName}>Tên Sự Kiện</div>
        <div className={styles.columnDate}>Ngày Đăng Ký</div>
        <div className={styles.columnStatus}>Trạng Thái</div>
        <div className={styles.columnActions}>Hành Động</div>
      </div>

      <div className={styles.listContent}>
        {requests.map((request) => (
          <EventRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
