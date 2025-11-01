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
  const timeStart = startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  const timeEnd = endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })

  const infoCards = [
    {
      icon: Calendar,
      label: "Ngày",
      value: startDate.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    },
    {
      icon: Clock,
      label: "Thời gian",
      value: `${timeStart} - ${timeEnd}`,
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
                <p className={styles.value}>{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
