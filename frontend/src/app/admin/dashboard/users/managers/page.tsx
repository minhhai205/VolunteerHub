"use client";

// note: may need changes to setPage
import { useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

export default function VolunteersPage() {
  const volunteers = mockUsers.filter((u) => u.role.name === "MANAGER");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(currentPage);
  const totalPages = 10;

  useEffect(() => {
    router.push(`?page=${page}`);
  }, [page]);

  useEffect(() => {
    console.log("Fetching managers for page:", page);
    // fetch(`/api/users/volunteers?page=${page}`)
  }, [page]);

  // Pagination generation

  return (
    <div className="space-y-4">
      {volunteers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onRequestLock={() => {}}
          onShowDetail={() => {}}
        />
      ))}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {generatePaginationItems(page, totalPages).map((item, index) => (
            <PaginationItem key={index}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(item as number);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && setPage(page + 1)}
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
