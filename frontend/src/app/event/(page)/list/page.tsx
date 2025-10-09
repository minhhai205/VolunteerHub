"use client";

import { Search, Filter } from "lucide-react";
import { useEventList } from "../../hooks/useList";

import styles from "./list.module.css";
import { Header } from "@/components/static/Header";
import EventCard from "./EventCard";
import { Footer } from "@/components/static/Footer";

export default function DashboardPage() {
  const { events, loading, error } = useEventList();

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>
            Danh sách sự kiện tình nguyện
          </h1>
          <p className={styles.dashboardSubtitle}>
            Khám phá và tham gia các hoạt động tình nguyện ý nghĩa
          </p>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className={styles.searchInput}
            />
          </div>
          <button className={styles.filterButton}>
            <Filter />
            <span>Lọc</span>
          </button>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tất cả sự kiện</h2>
            <span className={styles.eventCount}>{events.length} sự kiện</span>
          </div>

          {loading && <p>Đang tải danh sách sự kiện...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && (
            <div className={styles.eventsGrid}>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  participants={event.participants}
                  comments={event.comments}
                  likes={event.likes}
                  isNew={event.isNew}
                  isTrending={event.isTrending}
                  image={event.image}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
