"use client";

import React, { createContext, useContext, useState } from "react";
import type { User } from "@/lib/mockData";

type UsersModalContextType = {
  openDetail: (user: User) => void;
  openLock: (user: User, action: "lock" | "unlock") => void;
  closeDetail: () => void;
  closeLock: () => void;
  selectedUser: User | null;
  lockAction: "lock" | "unlock";
  showDetailDialog: boolean;
  showLockDialog: boolean;
};

const UsersModalContext = createContext<UsersModalContextType | undefined>(
  undefined
);

export function UsersModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockAction, setLockAction] = useState<"lock" | "unlock">("lock");

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };
  const closeDetail = () => {
    setShowDetailDialog(false);
    setSelectedUser(null);
  };
  const openLock = (user: User, action: "lock" | "unlock") => {
    setSelectedUser(user);
    setLockAction(action);
    setShowLockDialog(true);
  };
  const closeLock = () => {
    setShowLockDialog(false);
    setSelectedUser(null);
  };

  return (
    <UsersModalContext.Provider
      value={{
        openDetail,
        openLock,
        closeDetail,
        closeLock,
        selectedUser,
        lockAction,
        showDetailDialog,
        showLockDialog,
      }}
    >
      {children}
    </UsersModalContext.Provider>
  );
}

export function useUsersModal() {
  const ctx = useContext(UsersModalContext);
  if (!ctx)
    throw new Error("useUsersModal must be used within UsersModalProvider");
  return ctx;
}
