import styles from "./CompletionHeader.module.css";

interface CompletionHeaderProps {
  title: string;
  subtitle: string;
}

export default function CompletionHeader({
  title,
  subtitle,
}: CompletionHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
