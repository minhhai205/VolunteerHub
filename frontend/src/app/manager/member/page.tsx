"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompletionHeader from "./components/CompletionHeader";
import FilterBar from "./components/FilterBar";
import BulkActions from "./components/BulkActions";
import VolunteerTable from "./components/VolunteerTable";
import type { Volunteer } from "./components/VolunteerTable";
import styles from "./completion.module.css";
import { Header } from "@/components/static/HeaderManager";
import { Footer } from "@/components/static/Footer";
import { getAccessToken } from "@/lib/token";

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

  const dto: EventMemberFilterDTO = {
    search: searchQuery || undefined,
    eventId: selectedEvent !== "all" ? Number(selectedEvent) : undefined,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
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

      const response = await fetch(url, {
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
      const token = getAccessToken();
      const url = `http://localhost:8080/api/event/manager/my-event`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = getAccessToken();
      const params = buildQueryParams(dto);
      const url = `http://localhost:8080/api/event/event-members?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      } else {
        throw new Error(result.message || "Không thể tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching event members:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEventMembers();
  }, [selectedEvent, statusFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchEventMembers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectAll = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map((v) => v.id));
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

      // Map status string to boolean isCompleted for API
      const isCompleted = status.toUpperCase() === "COMPLETED";

      // Prepare DTOs for bulk update
      const dtos: WorkRatingDTO[] = selectedVolunteers.map((id) => ({
        id,
        isCompleted,
      }));

      // Call API
      await updateWorkRating(dtos);

      // Update local state
      setVolunteers(
        volunteers.map((v) =>
          selectedVolunteers.includes(v.id) ? { ...v, status } : v
        )
      );
      setSelectedVolunteers([]);
    } catch (err) {
      console.error("Error in bulk update:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi cập nhật hàng loạt"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setLoading(true);

      // Map status string to boolean isCompleted for API
      const isCompleted = status.toUpperCase() === "COMPLETED";

      // Prepare DTO for single update
      const dtos: WorkRatingDTO[] = [
        {
          id,
          isCompleted,
        },
      ];

      // Call API
      await updateWorkRating(dtos);

      // Update local state
      setVolunteers(
        volunteers.map((v) => (v.id === id ? { ...v, status } : v))
      );
    } catch (err) {
      console.error("Error in single update:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi cập nhật"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header></Header>
      <div className={styles.container}>
        <CompletionHeader
          title="Đánh Dấu Hoàn Thành"
          subtitle="Cập nhật trạng thái tham gia của tình nguyện viên sau sự kiện"
        />

        <div className="flex justify-center">
          <Card className="w-full">
            <CardHeader>
              <div className={styles.filterHeader}>
                <CardTitle>Danh sách tình nguyện viên</CardTitle>
                <BulkActions
                  selectedCount={selectedVolunteers.length}
                  onMarkCompleted={() => handleBulkUpdate("COMPLETED")}
                  onMarkAbsent={() => handleBulkUpdate("ABSENT")}
                />
              </div>
              <CardDescription>
                Quản lý trạng thái tham gia của tình nguyện viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedEvent={selectedEvent}
                onEventChange={setSelectedEvent}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                events={events}
              />

              {error && (
                <div className="text-center py-8 text-red-500">{error}</div>
              )}

              {!error && (
                <>
                  {loading && (
                    <div className="text-center py-8 text-gray-500">
                      Đang tải dữ liệu...
                    </div>
                  )}
                  <VolunteerTable
                    volunteers={volunteers}
                    selectedVolunteers={selectedVolunteers}
                    onSelectAll={handleSelectAll}
                    onSelectVolunteer={handleSelectVolunteer}
                    onUpdateStatus={handleUpdateStatus}
                    isLoading={loading}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
