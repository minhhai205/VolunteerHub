import { Calendar, MapPin } from "lucide-react";
import styles from "./event-request-card.module.css";

type EventStatus = "pending" | "approved" | "rejected";

interface EventRequestCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  categoryNames?: string[];
  status: EventStatus;
}

const statusConfig: Record<EventStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Chưa duyệt",
      className: styles.statusPending,
    },
    approved: {
      label: "Đã duyệt",
      className: styles.statusApproved,
    },
    rejected: {
      label: "Từ chối",
      className: styles.statusRejected,
    },
  };

export function EventRequestCard({
  id,
  name,
  description,
  location,
  imageUrl,
  startDate,
  endDate,
  categoryNames,
  status,
}: EventRequestCardProps) {
  return (
    <div className={styles.eventCard}>
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={name}
        className={styles.eventImage}
      />
      <div className={styles.eventContent}>
        <div className={styles.eventHeader}>
          <h2 className={styles.eventTitle}>{name}</h2>
          <span
            className={`${styles.eventStatus} ${statusConfig[status].className}`}
          >
            {statusConfig[status].label}
          </span>
        </div>

        <p className={styles.eventDescription}>{description}</p>

        {categoryNames && categoryNames.length > 0 && (
          <div className={styles.categoriesBadges}>
            {categoryNames.map((category) => (
              <span key={category} className={styles.categoryTag}>
                {category}
              </span>
            ))}
          </div>
        )}

        <div className={styles.eventFooter}>
          <div className={styles.eventMeta}>
            <div className={styles.metaItem}>
              <Calendar className={styles.metaIcon} size={16} />
              <span>
                {new Date(startDate).toLocaleDateString("vi-VN")}
                {startDate !== endDate &&
                  ` - ${new Date(endDate).toLocaleDateString("vi-VN")}`}
              </span>
            </div>
            <div className={styles.metaItem}>
              <MapPin className={styles.metaIcon} size={16} />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
