import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  status: EventStatus;
}

const statusConfig: Record<EventStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Chưa duyệt",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    approved: {
      label: "Đã duyệt",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    rejected: {
      label: "Từ chối",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
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
  status,
}: EventRequestCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.statusBadge}>
          <Badge className={statusConfig[status].className}>
            {statusConfig[status].label}
          </Badge>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className={styles.image}
            />
            <div className={styles.idBadge}>
              <span className={styles.idText}>ID: {id}</span>
            </div>
          </div>

          <CardContent className={styles.content}>
            <h3 className={styles.title}>{name}</h3>
            <p className={styles.description}>{description}</p>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <MapPin className={styles.metaIcon} />
                <span className={styles.metaText}>{location}</span>
              </div>

              <div className={styles.metaItem}>
                <Calendar className={styles.metaIcon} />
                <span>
                  {new Date(startDate).toLocaleDateString("vi-VN")}
                  {startDate !== endDate &&
                    ` - ${new Date(endDate).toLocaleDateString("vi-VN")}`}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
