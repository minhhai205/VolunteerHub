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
  const formattedStartDate = new Date(startDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={styles.eventCard}>
      {imageUrl && (
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className={styles.eventCardImage}
        />
      )}

      <div className={styles.eventCardContent}>
        <h3 className={styles.eventCardTitle}>{name}</h3>
        <p className={styles.eventCardDescription}>{description}</p>

        <div className={styles.eventCardInfo}>
          <div className={styles.eventCardDate}>
            <Calendar />
            <span>Ngày bắt đầu: {formattedStartDate}</span>
          </div>
          <div className={styles.eventCardDate}>
            <Calendar />
            <span>Ngày kết thúc: {formattedEndDate}</span>
          </div>
          <div className={styles.eventCardLocation}>
            <MapPin />
            <span>{location}</span>
          </div>
        </div>

        <div className={styles.eventCardCategories}>
          <Tag />
          <span>{categoryNames[0] || "Uncategorized"}</span>
        </div>

        <div className={styles.eventCardStats}>
          <div className={styles.eventCardStat}>
            <Users />
            <span>{countMembers} người tham gia</span>
          </div>
          <div className={styles.eventCardStat}>
            <MessageSquare />
            <span>{countPosts} bài viết</span>
          </div>
        </div>
      </div>
    </div>
  );
}
