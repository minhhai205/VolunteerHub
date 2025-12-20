import styles from "./styles/event-request-header.module.css";

interface EventRequestHeaderProps {
  totalRequests: number;
}

export default function EventRequestHeader({
  totalRequests,
}: EventRequestHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>Quản lí đơn đăng ký sự kiện</h1>
        <p className={styles.subtitle}>
          Quản lí và xử lí các đơn đăng ký từ tình nguyện viên
        </p>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Tổng đơn</span>
          <span className={styles.statValue}>{totalRequests}</span>
        </div>
      </div>
    </div>
  );
}
