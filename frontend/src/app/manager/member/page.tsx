"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompletionHeader from "./components/CompletionHeader";
import FilterBar from "./components/FilterBar";
import BulkActions from "./components/BulkActions";
import VolunteerTable from "./components/VolunteerTable";
import type { Volunteer } from "./components/VolunteerTable";
import styles from "./completion.module.css";
import { getAccessToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface EventMemberResponse {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    total: number;
    data: {
      id: number;
      memberName: string;
      email: string;
      eventName: string;
      registrationDate: string;
      workingHour: number;
      status: "PENDING" | "COMPLETED" | "ABSENT";
    }[];
  };
}

interface EventResponse {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    total: number;
    data: {
      id: number;
      name: string;
      description: string;
      location: string;
      imageUrl: string;
      startDate: string;
      endDate: string;
      categoryNames: string[];
      countMembers: number;
      countPosts: number;
    }[];
  };
}

interface Event {
  id: string;
  name: string;
}

export interface EventMemberFilterDTO {
  search?: string;
  eventId?: number;
  status?: string;
  page?: number;
  size?: number;
}

interface WorkRatingDTO {
  id: number;
  isCompleted: boolean;
}

interface WorkRatingRequest {
  dtos: WorkRatingDTO[];
}

export default function CompletionPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const dto: EventMemberFilterDTO = {
    search: searchQuery || undefined,
    eventId: selectedEvent !== "all" ? Number(selectedEvent) : undefined,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    page: currentPage - 1, // Backend starts from 0
    size: pageSize,
  };

  function buildQueryParams(dto: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return params;
  }

  // API call to update work rating
  const updateWorkRating = async (dtos: WorkRatingDTO[]) => {
    try {
      const token = getAccessToken();
      const url = `http://localhost:8080/api/event/work-rating`;

      const requestBody: WorkRatingRequest = { dtos };

      const response = await fetchWithAuth(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.message || "Không thể cập nhật đánh giá");
      }
    } catch (err) {
      console.error("Error updating work rating:", err);
      throw err;
    }
  };

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const url = `http://localhost:8080/api/event/manager/my-event`;

      const response = await fetchWithAuth(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: EventResponse = await response.json();

      if (result.status === 200 && result.data) {
        const transformedEvents: Event[] = result.data.data.map((event) => ({
          id: String(event.id),
          name: event.name,
        }));

        setEvents([...transformedEvents]);
      } else {
        throw new Error(result.message || "Không thể tải danh sách sự kiện");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Fetch data from API
  const fetchEventMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = buildQueryParams(dto);
      const url = `http://localhost:8080/api/event/event-members?${params.toString()}`;

      const response = await fetchWithAuth(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: EventMemberResponse = await response.json();

      if (result.status === 200 && result.data) {
        const transformedData: Volunteer[] = result.data.data.map((member) => ({
          id: member.id,
          name: member.memberName,
          email: member.email,
          eventId: "",
          eventName: member.eventName,
          registeredDate: new Date(member.registrationDate)
            .toISOString()
            .split("T")[0],
          status: member.status,
          phone: "",
          hours: member.workingHour,
        }));

        setVolunteers(transformedData);
        setTotalPages(result.data.totalPage);
        setTotalItems(result.data.total);
      } else {
        throw new Error(result.message || "Không thể tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching event members:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [selectedEvent, statusFilter]);

  useEffect(() => {
    fetchEventMembers();
  }, [currentPage, pageSize, selectedEvent, statusFilter, searchQuery]);

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleSelectAll = () => {
    // Chỉ select những volunteer có status pending
    const pendingVolunteers = volunteers
      .filter((v) => v.status.toLowerCase() === "pending")
      .map((v) => v.id);

    if (selectedVolunteers.length === pendingVolunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(pendingVolunteers);
    }
  };

  const handleSelectVolunteer = (id: number) => {
    if (selectedVolunteers.includes(id)) {
      setSelectedVolunteers(selectedVolunteers.filter((vid) => vid !== id));
    } else {
      setSelectedVolunteers([...selectedVolunteers, id]);
    }
  };

  const handleBulkUpdate = async (status: string) => {
    try {
      setLoading(true);

      const isCompleted = status.toUpperCase() === "COMPLETED";

      const dtos: WorkRatingDTO[] = selectedVolunteers.map((id) => ({
        id,
        isCompleted,
      }));

      await updateWorkRating(dtos);

      // Fetch lại data từ backend
      await fetchEventMembers();
      setSelectedVolunteers([]);
    } catch (err) {
      console.error("Error in bulk update:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi cập nhật hàng loạt",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setLoading(true);

      const isCompleted = status.toUpperCase() === "COMPLETED";

      const dtos: WorkRatingDTO[] = [
        {
          id,
          isCompleted,
        },
      ];

      await updateWorkRating(dtos);

      // Fetch lại data từ backend
      await fetchEventMembers();
    } catch (err) {
      console.error("Error in single update:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi cập nhật",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedVolunteers([]); // Clear selections when changing page
      window.scrollTo({ top: 0 }); // Scroll to top
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedVolunteers([]); // Clear selections
    window.scrollTo({ top: 0 }); // Scroll to top
  };

  return (
    <>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <CompletionHeader
            title="Quản lý đánh giá"
            subtitle="Cập nhật trạng thái tham gia của tình nguyện viên sau sự kiện"
          />

          <div className="flex justify-center">
            <Card className="w-full">
              <CardHeader>
                <div className={styles.filterHeader}>
                  <CardTitle>Danh sách tình nguyện viên</CardTitle>
                </div>
                <CardDescription>
                  Quản lý trạng thái tham gia của tình nguyện viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                  selectedEvent={selectedEvent}
                  onEventChange={setSelectedEvent}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  events={events}
                />

                <BulkActions
                  selectedCount={selectedVolunteers.length}
                  onMarkCompleted={() => handleBulkUpdate("COMPLETED")}
                  onMarkAbsent={() => handleBulkUpdate("ABSENT")}
                  className="mt-6 mb-6"
                />

                {error && (
                  <div className="text-center py-8 text-red-500">{error}</div>
                )}

                {!error && (
                  <>
                    <VolunteerTable
                      volunteers={volunteers}
                      selectedVolunteers={selectedVolunteers}
                      onSelectAll={handleSelectAll}
                      onSelectVolunteer={handleSelectVolunteer}
                      onUpdateStatus={handleUpdateStatus}
                      isLoading={loading}
                    />

                    {/* Pagination Controls */}
                    {volunteers.length > 0 && (
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                        {/* Page size selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Hiển thị:
                          </span>
                          <select
                            value={pageSize}
                            onChange={(e) =>
                              handlePageSizeChange(Number(e.target.value))
                            }
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">/ trang</span>
                        </div>

                        {/* Page navigation */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-1 px-2">
                            {/* Show page numbers */}
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      currentPage === pageNum
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                    className={
                                      currentPage === pageNum
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "hover:bg-green-50 hover:border-green-300"
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              },
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="hover:bg-green-50 hover:border-green-300 disabled:opacity-50"
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
