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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import UserCard from "../components/UserCard";
import { generatePaginationItems } from "@/lib/pagination";
import { useSearchParams } from "next/navigation";
import { useUserList } from "../hooks/useUserList";
import { useUserSearch } from "../UserSearchContext";
import { User } from "@/lib/mockData";

function UserCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VolunteersPage() {
  const searchParams = useSearchParams();
  const { searchQuery, isSearching } = useUserSearch();

  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState<number>(currentPage);

  const { users, pagination, loading } = useUserList(
    page,
    10,
    "USER",
    searchQuery
  );
  const totalPages = Math.max(1, pagination.totalPage);

  const [optimisticUsers, setOptimisticUsers] = useState<User[]>([]);

  useEffect(() => {
    setOptimisticUsers(users);
  }, [users]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (searchQuery !== "") {
      setPage(1);
    }
  }, [searchQuery]);

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

  // listen for popstate to sync when user uses browser back/forward
  useEffect(() => {
    const onPop = () => {
      const sp = new URLSearchParams(window.location.search);
      const p = Number(sp.get("page")) || 1;
      setPage(p);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // update URL (pushState) when local page changes
  useEffect(() => {
    if (page !== currentPage && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      window.history.pushState({}, "", url.toString());
    }
  }, [page, currentPage]);

  // if backend reports fewer pages than requested, replace the route and set page
  useEffect(() => {
    if (loading) return;
    const tp = Math.max(1, pagination.totalPage || 1);
    if (page > tp && typeof window !== "undefined") {
      const newPage = tp;
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      window.history.replaceState({}, "", url.toString());
      setPage(newPage);
    }
  }, [loading, pagination.totalPage, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!loading && page > totalPages) {
    return null;
  }

  const showSkeleton = isSearching;

  return (
    <div className="space-y-4">
      {showSkeleton ? (
        <>
          {[...Array(5)].map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </>
      ) : optimisticUsers.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          {searchQuery
            ? "Không tìm thấy người dùng phù hợp."
            : "Không có tình nguyện viên nào."}
        </p>
      ) : (
        <div className="space-y-4 animate-in fade-in-0 duration-200">
          {optimisticUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {!showSkeleton && totalPages > 1 && (
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
