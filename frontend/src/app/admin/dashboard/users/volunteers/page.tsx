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
import { mockUsers } from "@/lib/mockData";
import { generatePaginationItems } from "@/lib/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserList } from "../hooks/useUserList";

export default function VolunteersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // get current page from URL (default 1)
  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(currentPage);

  // const volunteers = mockUsers.filter((u) => u.role.name === "USER");
  const { users, pagination } = useUserList(page, 10, "USER");
  const totalPages = pagination.totalPage;

  // keep URL and state in sync
  useEffect(() => {
    router.push(`?page=${page}`);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          // onRequestLock={() => {}}
          // onShowDetail={() => {}}
        />
      ))}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
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
              onClick={() => handlePageChange(page + 1)}
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
