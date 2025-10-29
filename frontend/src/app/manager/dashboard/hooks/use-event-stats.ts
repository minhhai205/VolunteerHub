"use client"

import { useState, useEffect } from "react"

export interface EventStatsData {
  totalEvents: number
  totalVolunteers: number
  trendingEvents: number
  newDiscussions: number
}

// Mock data for testing
const mockStatsData: EventStatsData = {
  totalEvents: 24,
  totalVolunteers: 156,
  trendingEvents: 5,
  newDiscussions: 42,
}

export function useEventStats() {
  const [data, setData] = useState<EventStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // For now, use mock data. Replace with API call when ready
        // const response = await fetch("/api/dashboard/stats")
        // if (!response.ok) throw new Error("Failed to fetch stats")
        // const result = await response.json()
        // setData(result)

        // Using mock data for testing
        setData(mockStatsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { data, loading, error }
}
