"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventList() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const event = {
    name: "Sự kiện mẫu",
    description: "Mô tả ngắn về sự kiện mẫu này để minh họa giao diện.",
    location: "Hà Nội",
    date: "20/10/2025",
    likes: 25,
    comments: 8,
    participants: 123,
    author: "Admin",
  };

  return (
    <div>
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Sự kiện chờ duyệt (1)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event Item */}
          <Card className="border-yellow-500/30 bg-card transition-all hover:shadow-lg hover:border-yellow-500/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                  >
                    Chờ duyệt
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm text-foreground">
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm text-foreground">
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm text-foreground">
                      {event.participants} người
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>
                      Tạo bởi:{" "}
                      <span className="text-foreground font-medium">
                        {event.author}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span>{event.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{event.comments}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    size="default"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1 sm:flex-none"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Duyệt sự kiện
                  </Button>
                  <Button
                    size="default"
                    variant="destructive"
                    className="flex-1 sm:flex-none"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* ✅ Event Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p>
              <strong>Địa điểm:</strong> {selectedEvent?.location}
            </p>
            <p>
              <strong>Ngày tổ chức:</strong> {selectedEvent?.date}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
