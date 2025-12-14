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
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isLoading?: boolean;
}

export default function EventRequestList({
  requests,
  onApprove,
  onReject,
  isLoading = false,
}: EventRequestListProps) {
  // Show skeleton while loading
  if (isLoading && requests.length === 0) {
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
          {/* Skeleton loading state - you can customize this */}
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ display: "inline-block" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #f0f0f0",
                  borderTop: "3px solid #4caf50",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              ></div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ marginTop: "1rem", color: "#666" }}>
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div
        className={`${styles.listContent} ${isLoading ? styles.loading : ""}`}
      >
        {requests.map((request) => (
          <EventRequestCard
            key={request.id}
            request={request}
            onApprove={() => onApprove(request.id)}
            onReject={() => onReject(request.id)}
          />
        ))}
      </div>
    </div>
  );
}
