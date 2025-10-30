"use client"

import { useState, useEffect } from "react"

export interface TrendingEvent {
  id: number
  title: string
  members: number
  discussions: number
  likes: number
  growth: string
  image: string
}

// Mock data for testing
const mockTrendingEvents: TrendingEvent[] = [
  {
    id: 1,
    title: "Trồng cây xanh thành phố",
    members: 89,
    discussions: 34,
    likes: 156,
    growth: "+45%",
    image: "/images/home1.jpg",
  },
  {
    id: 2,
    title: "Dạy lập trình cho trẻ em",
    members: 67,
    discussions: 28,
    likes: 124,
    growth: "+38%",
    image: "/images/home1.jpg",
  },
  {
    id: 3,
    title: "Dọn dẹp bãi biển",
    members: 102,
    discussions: 45,
    likes: 198,
    growth: "+52%",
    image: "/images/home1.jpg",
  },
]

export function useTrendingEvents() {
  const [events, setEvents] = useState<TrendingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // For now, use mock data. Replace with API call when ready
        // const response = await fetch("/api/events/trending")
        // if (!response.ok) throw new Error("Failed to fetch trending events")
        // const result = await response.json()
        // setEvents(result)

        // Using mock data for testing
        setEvents(mockTrendingEvents)
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
