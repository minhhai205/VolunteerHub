"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { EventRequest } from "../hooks/useEventRequest";
import { EventRequestCard } from "./EventRequestCard";
import { EventDetailDialog } from "./EventDetailDialog";

interface EventListProps {
  eventRequests?: EventRequest[];
}

export default function EventList({ eventRequests = [] }: EventListProps) {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Sự kiện chờ duyệt ({eventRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {eventRequests.map((eventRequest) => (
            <EventRequestCard
              key={eventRequest.id}
              eventRequest={eventRequest}
              onViewDetail={() => {
                setSelectedEvent(eventRequest);
                setOpen(true);
              }}
            />
          ))}
        </CardContent>
      </Card>

      <EventDetailDialog
        open={open}
        onOpenChange={setOpen}
        event={selectedEvent}
      />
    </div>
  );
}
