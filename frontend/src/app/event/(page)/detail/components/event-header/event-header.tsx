/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import type { Event } from "../../../../hooks/useDetail";
import {
  isUserRole,
  isManagerRole,
  isEventEnded,
  fetchRegistrationStatus,
  registerForEvent,
  cancelRegistration,
  leaveEvent,
} from "../../../../hooks/useDetail";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import styles from "./event-header.module.css";
import { toastManager } from "@/components/static/toast/toast";

interface EventHeaderProps {
  event: Event;
  onStatusChange?: () => void;
}

export default function EventHeader({
  event,
  onStatusChange,
}: EventHeaderProps) {
  const [registrationStatus, setRegistrationStatus] = useState<
    "NOT_REGISTERED" | "PENDING" | "APPROVED" | "REJECTED"
  >("NOT_REGISTERED");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const userRole = isUserRole();
  const isManager = isManagerRole();
  const eventEnded = isEventEnded(event.endDate);

  // Fetch registration status khi component mount
  useEffect(() => {
    const loadRegistrationStatus = async () => {
      if (userRole && !eventEnded) {
        try {
          const status = await fetchRegistrationStatus(event.id.toString());
          setRegistrationStatus(status);
        } catch (err) {
          console.error("Failed to fetch registration status:", err);
        }
      }
    };

    loadRegistrationStatus();
  }, [event.id, userRole, eventEnded]);

  // Calculate event progress based on dates
  const calculateEventProgress = (): number => {
    if (!event.startDate || !event.endDate) return 0;

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const progress = Math.round((elapsed / totalDuration) * 100);

    return Math.min(100, Math.max(0, progress));
  };

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

  // Xử lý đăng ký
  const handleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      await registerForEvent(event.id.toString());
      setRegistrationStatus("PENDING");
      onStatusChange?.();
      toastManager.success("Đăng kí thành công!");
    } catch (err: any) {
      toastManager.error("Đăng kí thất bại!");
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý hủy đăng ký (khi status = PENDING)
  const handleCancelRegistration = async () => {
    setIsLoading(true);
    setError("");

    try {
      await cancelRegistration(event.id.toString());
      setRegistrationStatus("NOT_REGISTERED");
      onStatusChange?.();
      toastManager.success("Hủy đăng kí thành công!");
    } catch (err: any) {
      toastManager.error("Hủy đăng kí thất bại!");
      setError(err.message || "Hủy đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý hủy tham gia (khi status = APPROVED)
  const handleLeaveEvent = async () => {
    setIsLoading(true);
    setError("");

    try {
      await leaveEvent(event.id.toString());
      setRegistrationStatus("NOT_REGISTERED");
      onStatusChange?.();
      toastManager.success("Hủy tham gia thành công!");
    } catch (err: any) {
      toastManager.error("Hủy tham gia thất bại!");
      setError(err.message || "Hủy tham gia thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Render button dựa trên trạng thái
  const renderActionButton = () => {
    // Nếu là MANAGER, hiển thị progress bar
    if (isManager) {
      const progress = calculateEventProgress();
      return (
        <div className={styles.managerSection}>
          <div className={styles.progressLabel}>Tiến độ sự kiện</div>
          <Progress value={progress} className={styles.progressBar} />
          <div className={styles.progressText}>{progress}% hoàn thành</div>
        </div>
      );
    }

    // Nếu không phải USER role
    if (!userRole) {
      return (
        <button className={`${styles.registerBtn} ${styles.disabled}`} disabled>
          Chỉ tình nguyện viên mới được đăng ký
        </button>
      );
    }

    // Nếu sự kiện đã kết thúc
    if (eventEnded) {
      return (
        <button className={`${styles.registerBtn} ${styles.disabled}`} disabled>
          Sự kiện đã kết thúc
        </button>
      );
    }

    // Dựa vào registration status
    switch (registrationStatus) {
      case "NOT_REGISTERED":
        return (
          <button
            className={styles.registerBtn}
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký tham gia"}
          </button>
        );

      case "PENDING":
        return (
          <button
            className={`${styles.registerBtn} ${styles.pending}`}
            onClick={handleCancelRegistration}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Hủy đăng ký"}
          </button>
        );

      case "APPROVED":
        return (
          <button
            className={`${styles.registerBtn} ${styles.approved}`}
            onClick={handleLeaveEvent}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Hủy tham gia"}
          </button>
        );

      case "REJECTED":
        return (
          <button
            className={`${styles.registerBtn} ${styles.disabled}`}
            disabled
          >
            Đăng ký bị từ chối
          </button>
        );

      default:
        return null;
    }
  };

  // Render status text
  const getStatusText = () => {
    if (!userRole) {
      return "Bạn cần có quyền USER để đăng ký";
    }

    if (eventEnded) {
      return "Sự kiện đã kết thúc, không thể đăng ký";
    }

    switch (registrationStatus) {
      case "NOT_REGISTERED":
        return "Đăng ký ngay để không bỏ lỡ!";
      case "PENDING":
        return "Đơn đăng ký đang chờ duyệt";
      case "APPROVED":
        return "Bạn đã tham gia sự kiện này";
      case "REJECTED":
        return "Đơn đăng ký của bạn bị từ chối";
      default:
        return "";
    }
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
              {!isManager && (
                <div className={styles.cardContent}>
                  <div className={styles.priceTag}>
                    <span className={styles.priceLabel}>
                      {registrationStatus === "APPROVED"
                        ? "Đã tham gia"
                        : registrationStatus === "PENDING"
                        ? "Chờ duyệt"
                        : "Đăng kí tham gia"}
                    </span>
                    <Clock className={styles.clockIcon} />
                  </div>
                  <p className={styles.registerText}>{getStatusText()}</p>
                  {error && <p className={styles.errorText}>{error}</p>}
                </div>
              )}
              {renderActionButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
