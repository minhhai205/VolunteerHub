"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/static/Footer";
import EventHeader from "../event-header/event-header";
import EventInfo from "../event-info/event-info";
import EventAbout from "../event-about/event-about";
import EventDiscussion from "../event-discussion/event-discussion";
import { fetchEventData, Event } from "../../../../hooks/useDetail";
import { getUserRole } from "@/lib/getDataFromToken";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [HeaderComponent, setHeaderComponent] =
    useState<React.ComponentType | null>(null);

  const params = useParams();
  const eventId = params.eventId as string;

  // Load event data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!eventId) return;
        const data = await fetchEventData(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId]);

  // Load user role and select header
  useEffect(() => {
    const role = getUserRole();
    setRole(role);

    if (role === "MANAGER") {
      import("@/components/static/HeaderManager").then((mod) =>
        setHeaderComponent(() => mod.Header)
      );
    } else {
      import("@/components/static/Header").then((mod) =>
        setHeaderComponent(() => mod.Header)
      );
    }
  }, []);

  if (loading || !HeaderComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Không tìm thấy sự kiện</p>
      </div>
    );
  }

  // Get event status based on dates
  const getEventStatus = () => {
    if (!event.startDate || !event.endDate) return "Sắp diễn ra";

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) return "Sắp diễn ra";
    if (now > end) return "Đã kết thúc";
    return "Đang diễn ra";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderComponent />

      <main className="flex-1">
        <EventHeader event={event} />
        <EventInfo event={event} />

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventAbout event={event} />
            <EventDiscussion eventId={event.id.toString()} />
          </div>

          <aside className="hidden lg:block">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
              <h3 className="font-bold text-primary mb-4">Chi tiết sự kiện</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold mb-1">
                    DANH MỤC
                  </p>
                  <p className="font-semibold text-foreground">
                    {event.categoryNames?.join(", ") || "Sự kiện"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold mb-1">
                    TRẠNG THÁI
                  </p>
                  <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {getEventStatus()}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
