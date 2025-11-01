"use client";

import type { Event } from "../../../../hooks/useDetail";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import styles from "./event-header.module.css";

interface EventHeaderProps {
  event: Event;
}

export default function EventHeader({ event }: EventHeaderProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format date range
  const getDateRange = () => {
    if (event.startDate && event.endDate) {
      return `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`;
    }
    return "Chưa xác định";
  };

  // Get event status
  const getEventStatus = () => {
    if (!event.startDate || !event.endDate) return "Sắp diễn ra";

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) return "Sắp diễn ra";
    if (now > end) return "Đã kết thúc";
    return "Đang diễn ra";
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbItem}>Trang chủ</span>
          <span className={styles.separator}>/</span>
          <span className={styles.breadcrumbItem}>Sự kiện</span>
          <span className={styles.separator}>/</span>
          <span className={styles.breadcrumbActive}>{event.name}</span>
        </nav>

        {/* Main Header */}
        <div className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>{event.name}</h1>
              <div className={styles.badge}>{getEventStatus()}</div>
            </div>

            <div className={styles.organizer}>
              <div className={styles.organizerAvatar}>{"U"}</div>
              <div>
                <p className={styles.organizerLabel}>Tổ chức bởi</p>
                <p className={styles.organizerName}>{"UET Volunteer Club"}</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className={styles.quickInfo}>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <span>{getDateRange()}</span>
              </div>
              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                <span>{event.location || "Chưa xác định"}</span>
              </div>
              <div className={styles.infoItem}>
                <Users className={styles.infoIcon} />
                <span>{event.countMembers || 0} người tham gia</span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.registerCard}>
              <div className={styles.cardContent}>
                <div className={styles.priceTag}>
                  <span className={styles.priceLabel}>Đăng kí tham gia</span>
                  <Clock className={styles.clockIcon} />
                </div>
                <p className={styles.registerText}>
                  Đăng ký ngay để không bỏ lỡ!
                </p>
              </div>
              <button className={styles.registerBtn}>Đăng ký tham gia</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
