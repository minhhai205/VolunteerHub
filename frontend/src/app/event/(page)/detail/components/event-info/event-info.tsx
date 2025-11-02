"use client"
import type { Event } from "../../../../hooks/useDetail"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import styles from "./event-info.module.css"

interface EventInfoProps {
  event: Event
}

export default function EventInfo({ event }: EventInfoProps) {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const infoCards = [
    {
      icon: Calendar,
      label: "Ngày bắt đầu",
      date: formatDate(startDate),
      time: formatTime(startDate),
    },
    {
      icon: Clock,
      label: "Ngày kết thúc",
      date: formatDate(endDate),
      time: formatTime(endDate),
    },
    {
      icon: MapPin,
      label: "Địa điểm",
      value: event.location,
    },
    {
      icon: Users,
      label: "Người tham gia",
      value: (event.countMembers || 0).toString(),
    },
  ]

  return (
    <div className={styles.infoSection}>
      <div className={styles.infoGrid}>
        {infoCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className={styles.infoCard}>
              <div className={styles.cardIcon}>
                <Icon className={styles.icon} />
              </div>
              <div>
                <p className={styles.label}>{card.label}</p>
                <p className={styles.value}>
                  {"date" in card && "time" in card ? (
                    <>
                      {card.date}
                      <span style={{ marginLeft: "1rem", opacity: 0.7 }}>
                        {card.time}
                      </span>
                    </>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}