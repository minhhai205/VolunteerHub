import styles from "./list.module.css";
import { Calendar, Users, MessageSquare, MapPin, Tag } from "lucide-react";

interface EventCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  categoryNames: string[];
  countMembers: number;
  countPosts: number;
  imageUrl?: string;
}

export default function EventCard({
  name,
  description,
  location,
  startDate,
  endDate,
  categoryNames,
  countMembers,
  countPosts,
  imageUrl,
}: EventCardProps) {
  const formattedDate = new Date(startDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={styles.eventCard}>
      {imageUrl && (
        <img src={imageUrl} alt={name} className={styles.eventCardImage} />
      )}

      <div className={styles.eventCardContent}>
        <h3 className={styles.eventCardTitle}>{name}</h3>
        <p className={styles.eventCardDescription}>{description}</p>

        <div className={styles.eventCardInfo}>
          <div className={styles.eventCardDate}>
            <Calendar />
            <span>{formattedDate}</span>
          </div>
          <div className={styles.eventCardLocation}>
            <MapPin />
            <span>{location}</span>
          </div>
        </div>

        <div className={styles.eventCardCategories}>
          <Tag />
          <span>{categoryNames.join(", ")}</span>
        </div>

        <div className={styles.eventCardStats}>
          <div className={styles.eventCardStat}>
            <Users />
            <span>{countMembers}</span>
          </div>
          <div className={styles.eventCardStat}>
            <MessageSquare />
            <span>{countPosts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
