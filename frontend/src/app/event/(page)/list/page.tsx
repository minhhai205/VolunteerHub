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
        {/* Tiêu đề trang */}
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>
            Danh sách sự kiện tình nguyện
          </h1>
          <p className={styles.dashboardSubtitle}>
            Khám phá và tham gia các hoạt động tình nguyện ý nghĩa
          </p>
        </div>

        {/* Thanh tìm kiếm và lọc */}
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

        {/* Danh sách sự kiện */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tất cả sự kiện</h2>
            <span className={styles.eventCount}>{events.length} sự kiện</span>
          </div>

          {/* Trạng thái tải */}
          {loading && <p>Đang tải danh sách sự kiện...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {/* Hiển thị danh sách */}
          {!loading && !error && events.length > 0 && (
            <div className={styles.eventsGrid}>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  name={event.name}
                  description={event.description}
                  location={event.location}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  categoryNames={event.categoryNames}
                  countMembers={event.countMembers}
                  countPosts={event.countPosts}
                  imageUrl={
                    event.imageUrl && event.imageUrl.trim() !== ""
                      ? event.imageUrl
                      : "https://pbs.twimg.com/media/GSHywsIaUAA0ero?format=jpg&name=4096x4096"
                  }
                />
              ))}
            </div>
          )}

          {/* Không có sự kiện */}
          {!loading && !error && events.length === 0 && (
            <p>Không có sự kiện nào để hiển thị.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
