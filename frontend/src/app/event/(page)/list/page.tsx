"use client";

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useEventList } from "../../hooks/useList";
import { useCategories } from "../../hooks/useCategories";
import styles from "./list.module.css";
import { Header } from "@/components/static/Header";
import EventCard from "./EventCard";
import { Footer } from "@/components/static/Footer";

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState(""); // Giá trị input
  const [search, setSearch] = useState(""); // Giá trị dùng để tìm kiếm (gửi API)
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const suggestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { categories } = useCategories();

  const pageable = {
    page,
    size,
  };

  const filters = {
    category: selectedCategory || undefined,
    status: selectedStatus || undefined,
    fromDate: fromDate || undefined,
  };

  const { events, loading, error, totalPages, totalElements } = useEventList(
    search,
    pageable,
    filters
  );

  // Show loading skeleton và scroll to top khi page hoặc search thay đổi
  useEffect(() => {
    setDisplayLoading(true);
    window.scrollTo(0, 0);
  }, [page, search]);

  // Hide loading skeleton khi data load xong
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Fetch suggestions từ API event
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        search: query,
      });

      const response = await fetch(
        `http://localhost:8080/api/event/suggestions?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Response trả về Set<String> - chuyển thành Array
        const eventNames = Array.isArray(result.data) ? result.data : [];
        setSuggestions(eventNames);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedSuggestionIndex(-1); // Reset selection khi gõ
    setIsKeyboardNavigation(false); // Reset keyboard navigation flag

    // Clear previous timeout
    if (suggestTimeoutRef.current) {
      clearTimeout(suggestTimeoutRef.current);
    }

    // Hiển thị suggestions nếu có text
    if (value.trim()) {
      setShowSuggestions(true);
      // Debounce API call - 300ms
      suggestTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    return () => {
      if (suggestTimeoutRef.current) {
        clearTimeout(suggestTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (query: string) => {
    setSearch(query);
    setSearchInput(query);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    setIsKeyboardNavigation(false);
    setPage(0);
  };

  const handleSearchFocus = () => {
    // Hiển thị suggestions khi click vào input nếu đã có suggestions
    if (searchInput.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearchSubmit(searchInput);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedSuggestionIndex((prev) => {
          const newIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
          if (newIndex >= 0) {
            setSearchInput(suggestions[newIndex]);
          }
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedSuggestionIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : -1;
          if (newIndex >= 0) {
            setSearchInput(suggestions[newIndex]);
          } else {
            setSearchInput("");
          }
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSearchSubmit(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearchSubmit(searchInput);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsKeyboardNavigation(false);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setFromDate("");
    setPage(0);
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
          <div className={styles.searchBox} ref={searchBoxRef}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className={styles.searchInput}
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleSearchFocus}
            />
            {/* Suggest Box */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestBox}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`${styles.suggestItem} ${
                      index === selectedSuggestionIndex && isKeyboardNavigation
                        ? styles.suggestItemActive
                        : index === selectedSuggestionIndex &&
                          !isKeyboardNavigation
                        ? styles.suggestItemHover
                        : ""
                    }`}
                    onClick={() => {
                      handleSearchSubmit(suggestion);
                      setIsKeyboardNavigation(false);
                    }}
                    onMouseEnter={() => {
                      setIsKeyboardNavigation(false);
                      setSelectedSuggestionIndex(index);
                    }}
                    onMouseLeave={() => {
                      setSelectedSuggestionIndex(-1);
                    }}
                  >
                    <Search size={16} />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <select
            className={styles.barFilterSelect}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className={styles.barFilterSelect}
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Sắp diễn ra</option>
            <option value="1">Đang diễn ra</option>
            <option value="2">Đã kết thúc</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            className={styles.dateFilterInput}
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(0);
            }}
            title="Lọc từ ngày"
          />

          {/* Filter Toggle Button */}
          <button
            className={styles.filterButton}
            onClick={handleResetFilters}
            title="Xóa bộ lọc"
          >
            <X size={18} />
          </button>
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
                    status={event.status}
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
          {!displayLoading && !error && events.length === 0 && (
            <p>Không có sự kiện nào để hiển thị.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
