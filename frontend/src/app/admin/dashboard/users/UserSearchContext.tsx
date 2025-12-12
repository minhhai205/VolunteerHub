"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}

const UserSearchContext = createContext<UserSearchContextType | undefined>(
  undefined
);

export function UserSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <UserSearchContext.Provider
      value={{ searchQuery, setSearchQuery, isSearching, setIsSearching }}
    >
      {children}
    </UserSearchContext.Provider>
  );
}

export function useUserSearch() {
  const context = useContext(UserSearchContext);
  if (!context) {
    throw new Error("useUserSearch must be used within UserSearchProvider");
  }
  return context;
}
