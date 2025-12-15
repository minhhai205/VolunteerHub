"use client";

import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import UserCard from "../components/UserCard";
import { generatePaginationItems } from "@/lib/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserList } from "../hooks/useUserList";
import { useUserSearch } from "../UserSearchContext";
import { User } from "@/lib/mockData";

export default function ManagersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchQuery } = useUserSearch();

  // read page from URL (1-based)
  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState<number>(currentPage);

  // fetch managers (role = MANAGER) with search
  const { users, pagination, loading } = useUserList(
    page,
    10,
    "MANAGER",
    searchQuery
  );
  const totalPages = Math.max(1, pagination.totalPage);

  // Optimistic state for UI
  const [optimisticUsers, setOptimisticUsers] = useState<User[]>([]);

  // Sync server data to optimistic state
  useEffect(() => {
    setOptimisticUsers(users);
  }, [users]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Listen for optimistic lock/unlock events
  useEffect(() => {
    const onOptimistic = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        userId: string;
        lock: boolean;
      };
      setOptimisticUsers((prev) =>
        prev.map((u) =>
          u.id === detail.userId
            ? { ...u, status: detail.lock ? "locked" : "active" }
            : u
        )
      );
    };

    const onRevert = (e: Event) => {
      const detail = (e as CustomEvent).detail as { userId: string };
      setOptimisticUsers((prev) =>
        prev.map((u) => {
          const server = users.find((s) => s.id === detail.userId);
          return server ? server : u;
        })
      );
    };

    window.addEventListener("user-lock-optimistic", onOptimistic);
    window.addEventListener("user-lock-revert", onRevert);

    return () => {
      window.removeEventListener("user-lock-optimistic", onOptimistic);
      window.removeEventListener("user-lock-revert", onRevert);
    };
  }, [users]);

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
    if (loading) return;
    const tp = Math.max(1, pagination.totalPage || 1);
    if (page > tp) {
      const newPage = tp;
      router.replace(`?page=${newPage}`);
      setPage(newPage);
    }
  }, [loading, pagination.totalPage, page, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // If we determined the current page is invalid and are redirecting, show nothing / loading
  if (!loading && page > totalPages) {
    return null;
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-muted-foreground">Đang tải...</p>
      ) : optimisticUsers.length === 0 ? (
        <p className="text-muted-foreground">
          {searchQuery
            ? "Không tìm thấy người dùng phù hợp."
            : "Không có quản lý sự kiện nào."}
        </p>
      ) : (
        optimisticUsers.map((user) => <UserCard key={user.id} user={user} />)
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {generatePaginationItems(page, totalPages).map((item, index) => (
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
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
