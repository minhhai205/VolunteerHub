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
        <h1 className={styles.title}>Yêu cầu của tôi</h1>
        <p className={styles.subtitle}>Trạng thái các yêu cầu tôi đã gửi</p>
      </div>
    </div>
  );
}
