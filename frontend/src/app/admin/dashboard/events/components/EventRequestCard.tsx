"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Check,
  Eye,
  Heart,
  MapPin,
  MessageSquare,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventRequest } from "../hooks/useEventRequest";

interface EventRequestCardProps {
  eventRequest: EventRequest;
  onViewDetail?: () => void;
}

export function EventRequestCard({
  eventRequest,
  onViewDetail,
}: EventRequestCardProps) {
  return (
    <Card className="border-yellow-500/30 bg-card transition-all hover:shadow-lg hover:border-yellow-500/50">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {eventRequest.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {eventRequest.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
            >
              {eventRequest.status === "PENDING"
                ? "Chờ duyệt"
                : eventRequest.status === "APPROVED"
                ? "Đã duyệt"
                : "Từ chối"}
            </Badge>
          </div>

          {/* Details */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm text-foreground">
                {eventRequest.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm text-foreground">
                {new Date(eventRequest.startDate).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}{" "}
                -{" "}
                {new Date(eventRequest.endDate).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm text-foreground">123 người</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>
                Tạo bởi:{" "}
                <span className="text-foreground font-medium">Admin</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>25</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>8</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-between gap-3 pt-2">
            {/* Left side */}
            <div>
              <Button
                size="default"
                className="cursor-pointer"
                variant="outline"
                onClick={() => onViewDetail?.()}
              >
                <Eye className="mr-2 h-4 w-4" />
                Chi tiết
              </Button>
            </div>
            {/* Right side */}
            <div className="flex gap-3">
              <Button
                size="default"
                className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1 sm:flex-none cursor-pointer"
              >
                <Check className="mr-2 h-4 w-4" /> Duyệt sự kiện
              </Button>
              <Button
                size="default"
                variant="destructive"
                className="flex-1 sm:flex-none cursor-pointer"
              >
                <X className="mr-2 h-4 w-4" /> Từ chối
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
