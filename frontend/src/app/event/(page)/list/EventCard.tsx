import styles from "./list.module.css";
import { Calendar, Users, MessageSquare, MapPin, Tag } from "lucide-react";
import Link from "next/link";

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
  id,
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

  // Giới hạn description nếu quá dài
  const truncatedDescription =
    description.length > 120
      ? description.substring(0, 120) + "..."
      : description;

  return (
    <Link href={`/events/${id}`} className={styles.eventCardLink}>
      <div className={styles.eventCard}>
        {imageUrl && (
          <div className={styles.eventCardImageWrapper}>
            <img src={imageUrl} alt={name} className={styles.eventCardImage} />
          </div>
        )}

        <div className={styles.eventCardContent}>
          <h3 className={styles.eventCardTitle}>{name}</h3>
          <p className={styles.eventCardDescription}>{truncatedDescription}</p>

          <div className={styles.eventCardInfo}>
            <div className={styles.eventCardDate}>
              <Calendar size={16} />
              <span>{formattedStartDate}</span>
            </div>
            <div className={styles.eventCardDate}>
              <Calendar size={16} />
              <span>{formattedEndDate}</span>
            </div>
            <div className={styles.eventCardLocation}>
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          </div>

          {categoryNames && categoryNames.length > 0 && (
            <div className={styles.eventCardCategories}>
              <Tag size={16} />
              <div className={styles.categoryTags}>
                {categoryNames.slice(0, 3).map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {category}
                  </span>
                ))}
                {categoryNames.length > 3 && (
                  <span className={styles.categoryTag}>
                    +{categoryNames.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={styles.eventCardStats}>
            <div className={styles.eventCardStat}>
              <Users size={16} />
              <span>{countMembers}</span>
            </div>
            <div className={styles.eventCardStat}>
              <MessageSquare size={16} />
              <span>{countPosts}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
