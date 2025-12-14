import styles from "./stats-card.module.css";

interface StatsCardProps {
  label: string;
  count: number;
}

export function StatsCard({ label, count }: StatsCardProps) {
  return (
    <div className={styles.statsCard}>
      <p className={styles.label}>{label}</p>
      <p className={styles.count}>{count}</p>
    </div>
  );
}
