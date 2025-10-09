import styles from "./list.module.css";
import { Calendar, Users, MessageSquare, Heart } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  participants: number;
  posts: number;
  image?: string;
}

export default function EventCard({
  title,
  date,
  participants,
  posts,
  image,
}: EventCardProps) {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventCardContent}>
        <h3 className={styles.eventCardTitle}>{title}</h3>
        <div className={styles.eventCardDate}>
          <Calendar />
          <span>{date}</span>
        </div>
        <div className={styles.eventCardStats}>
          <div className={styles.eventCardStat}>
            <Users />
            <span>{participants}</span>
          </div>
          <div className={styles.eventCardStat}>
            <MessageSquare />
            <span>{posts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
