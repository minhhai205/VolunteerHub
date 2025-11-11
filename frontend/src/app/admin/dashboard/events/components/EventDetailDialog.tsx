"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventRequest } from "../hooks/useEventRequest";

interface EventDetailDialogProps {
  event: EventRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
}: EventDetailDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p>
            <strong>Địa điểm:</strong> {event.location}
          </p>
          <p>
            <strong>Ngày tổ chức:</strong>{" "}
            {new Date(event.startDate).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}{" "}
            →{" "}
            {new Date(event.endDate).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p>
            <strong>Trạng thái:</strong> {event.status}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
