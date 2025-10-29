"use client"

import { useState, useEffect } from "react"

export interface Activity {
  id: number
  type: string
  user: string
  action: string
  target: string
  time: string
  icon: unknown
  color: string
}

export function useRecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/activities/recent")
        if (!response.ok) throw new Error("Failed to fetch activities")
        const result = await response.json()
        setActivities(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading, error }
}
