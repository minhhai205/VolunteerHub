"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Heart,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import EventSearch from "./components/EventSearch";
import SummaryCard from "./components/SummaryCard";
import EventList from "./components/EventList";
import { useEventRequests } from "./hooks/useEventRequest";
import { useEffect } from "react";

export default function EventsPage() {
  // sử dụng hook để lấy dữ liệu yêu cầu sự kiện
  const { eventRequests, isLoading, error } = useEventRequests();

  useEffect(() => {
    console.log("EventRequests:", eventRequests);
    console.log("Loading:", isLoading);
    console.log("Error:", error);
  }, [eventRequests, isLoading, error]);

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Quản lý sự kiện
            </h1>
            <p className="text-muted-foreground">
              Duyệt, từ chối hoặc xóa các sự kiện chờ phê duyệt
            </p>
          </div>

          {/* Summary cards */}
          <SummaryCard />

          {/* Search bar */}
          <EventSearch />

          {/* Event list (pass data down) */}
          <EventList eventRequests={eventRequests} />
        </div>
      </main>
    </div>
  );
}
