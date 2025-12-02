"use client";

import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useEventList } from "../../hooks/useList";
import styles from "./list.module.css";
import { Header } from "@/components/static/Header";
import EventCard from "./EventCard";
import { Footer } from "@/components/static/Footer";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [displayLoading, setDisplayLoading] = useState(false);

  const pageable = {
    page,
    size,
  };

  const { events, loading, error, totalPages, totalElements } = useEventList(
    search,
    pageable
  );

  // Show loading skeleton và scroll to top khi page thay đổi
  useEffect(() => {
    setDisplayLoading(true);
    window.scrollTo(0, 0);
  }, [page]);

  // Hide loading skeleton khi data load xong
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0); // Reset về trang đầu khi tìm kiếm
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

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
              placeholder="Tìm kiếm sự kiện theo tên sự kiện hoặc mô tả..."
              className={styles.searchInput}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          {/* <button className={styles.filterButton}>
            <Filter />
            <span>Lọc</span>
          </button> */}
        </div>

        {/* Danh sách sự kiện */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tất cả sự kiện</h2>
            <span className={styles.eventCount}>
              {totalElements || events.length} sự kiện
            </span>
          </div>

          {/* Trạng thái tải */}
          {displayLoading && (
            <div className={styles.eventsGrid}>
              {[...Array(size)].map((_, index) => (
                <div
                  key={index}
                  className={`${styles.eventCardSkeleton} ${styles.skeleton}`}
                >
                  <div className={`${styles.skeletonImage}`} />
                  <div className={styles.skeletonContent}>
                    <div
                      className={`${styles.skeletonText} ${styles.skeletonTitle}`}
                    />
                    <div
                      className={`${styles.skeletonText} ${styles.skeletonDescription}`}
                    />
                    <div
                      className={`${styles.skeletonText} ${styles.skeletonMeta}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}

          {/* Hiển thị danh sách */}
          {!displayLoading && !error && events.length > 0 && (
            <>
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

              {/* Phân trang */}
              {
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    <ChevronLeft size={9} />
                    <span>Trước</span>
                  </button>

                  <div className={styles.paginationInfo}>
                    <span>
                      Trang {page + 1} / {totalPages}
                    </span>
                  </div>

                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    <span>Sau</span>
                    <ChevronRight size={9} />
                  </button>
                </div>
              }
            </>
          )}

          {/* Không có sự kiện */}
          {!displayLoading && !error && events.length === 0 && (
            <p>Không có sự kiện nào để hiển thị.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
