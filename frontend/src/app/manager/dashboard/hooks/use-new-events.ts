"use client"

import { useState, useEffect } from "react"

export interface NewEvent {
  id: number
  title: string
  date: string
  location: string
  volunteers: number
  status: string
  description: string
}

// Mock data for testing
const mockNewEvents: NewEvent[] = [
  {
    id: 1,
    title: "Dạy kèm tiếng Anh cho trẻ em",
    date: "15/11/2024 - 20/11/2024",
    location: "Trường tiểu học Lê Lợi, Quận 1, TP.HCM",
    volunteers: 12,
    status: "Mới",
    description: "Tuyên bố mở đơn tình nguyện dạy kèm tiếng Anh cho các em học sinh lớp 3-5",
  },
  {
    id: 2,
    title: "Dọn dẹp công viên thành phố",
    date: "18/11/2024",
    location: "Công viên Tao Đàn, Quận 1, TP.HCM",
    volunteers: 8,
    status: "Mới",
    description: "Tham gia dọn dẹp và trồng cây xanh tại công viên Tao Đàn",
  },
  {
    id: 3,
    title: "Hỗ trợ người vô gia cư",
    date: "22/11/2024",
    location: "Trung tâm xã hội Bình Tân, Quận Bình Tân, TP.HCM",
    volunteers: 15,
    status: "Mới",
    description: "Phân phát lương thực, quần áo và cung cấp tư vấn sức khỏe cho người vô gia cư",
  },
]

export function useNewEvents() {
  const [events, setEvents] = useState<NewEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // For now, use mock data. Replace with API call when ready
        // const response = await fetch("/api/events/new")
        // if (!response.ok) throw new Error("Failed to fetch new events")
        // const result = await response.json()
        // setEvents(result)

        // Using mock data for testing
        setEvents(mockNewEvents)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error }
}
