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

export default function ManagersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read page from URL (1-based)
  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState<number>(currentPage);

  // fetch managers (role = MANAGER)
  const { users, pagination } = useUserList(page, 10, "MANAGER");
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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      {users.map((user: any) => (
        <UserCard key={user.id} user={user} />
      ))}

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
    </div>
  );
}
