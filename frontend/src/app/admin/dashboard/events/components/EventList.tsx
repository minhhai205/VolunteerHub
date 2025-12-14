"use client";

import { useState } from "react";
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
    <div className="space-y-4">
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

      <EventDetailDialog
        open={open}
        onOpenChange={setOpen}
        event={selectedEvent}
      />
    </div>
  );
}
