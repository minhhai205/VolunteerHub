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

export default function EventsPage() {
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

          {/* Example event list */}
          <EventList />
        </div>
      </main>
    </div>
  );
}
