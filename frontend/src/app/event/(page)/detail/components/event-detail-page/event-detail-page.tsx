"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/static/Header";
import { Footer } from "@/components/static/Footer";
import EventHeader from "../event-header/event-header";
import EventInfo from "../event-info/event-info";
import EventAbout from "../event-about/event-about";
import EventDiscussion from "../event-discussion/event-discussion";
import { fetchEventData, Event } from "../../../../hooks/useDetail";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEventData("1");
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <EventHeader event={event} />
        <EventInfo event={event} />

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventAbout event={event} />
            <EventDiscussion eventId={event.id.toString()} />
          </div>

          <aside className="hidden lg:block">
            <div className="bg-white rounded-lg border border-border p-6 sticky top-24 box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
              <h3 className="font-bold text-primary mb-4">Chi tiết sự kiện</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold mb-1">
                    SỰ KIỆN
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
                    Đang tuyển
                  </span>
                </div>
                <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg active:scale-95">
                  Đăng ký tham gia
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
