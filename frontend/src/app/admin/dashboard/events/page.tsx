"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePaginationItems } from "@/lib/pagination";
import { useEventRequests } from "./hooks/useEventRequest";
import SummaryCard from "./components/SummaryCard";
import EventSearch from "./components/EventSearch";
import EventList from "./components/EventList";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read page from URL (1-based)
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus = (searchParams.get("status") || "pending") as
    | "pending"
    | "rejected"
    | "approved";
  const [page, setPage] = useState<number>(currentPage);

  // fetch event requests with pagination
  const {
    eventRequests,
    pagination,
    isLoading,
    error,
    handleApprove,
    handleReject,
  } = useEventRequests(page, 10, currentStatus);
  const totalPages = Math.max(1, pagination.totalPage);

  // keep local state in sync when user navigates back/forward
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  // push only when local page differs from URL to avoid loops
  useEffect(() => {
    if (page !== currentPage) {
      router.push(`?page=${page}`);
    }
  }, [page, currentPage, router]);

  // if backend reports fewer pages than requested, replace the route immediately
  useEffect(() => {
    if (isLoading) return;
    const tp = Math.max(1, pagination.totalPage || 1);
    if (page > tp) {
      const newPage = tp;
      router.replace(`?page=${newPage}`);
      setPage(newPage);
    }
  }, [isLoading, pagination.totalPage, page, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // If we determined the current page is invalid and are redirecting, show nothing
  if (!isLoading && page > totalPages) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Quản lý sự kiện
            </h1>
            <p className="text-muted-foreground">
              Duyệt, từ chối hoặc xóa các sự kiện chờ phê duyệt
            </p>
          </div>

          {/* Tabs: Pending / Rejected / Approved */}
          <div className="mb-4">
            <Tabs
              value={currentStatus}
              onValueChange={(val) => router.push(`?page=1&status=${val}`)}
            >
              <TabsList className="w-max">
                <TabsTrigger value="pending">Đang chờ</TabsTrigger>
                <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
                <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Summary cards */}
          <SummaryCard />

          {/* Search bar */}
          <EventSearch />

          {/* Event list */}
          {!isLoading && eventRequests.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Không có sự kiện nào
            </div>
          ) : (
            <EventList
              eventRequests={eventRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {/* Pagination */}
          {!isLoading && eventRequests.length > 0 && totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      aria-disabled={page === 1}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems(page, totalPages).map(
                    (item, index) => (
                      <PaginationItem key={index}>
                        {item === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={item === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(item as number);
                            }}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      aria-disabled={page === totalPages}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
