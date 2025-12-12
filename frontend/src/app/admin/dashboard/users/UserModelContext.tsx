"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import type { User } from "@/lib/mockData";

type UsersModalContextType = {
  openDetail: (user: User) => void;
  openLock: (user: User, action: "lock" | "unlock") => void;
  openCreate: () => void;
  closeDetail: () => void;
  closeLock: () => void;
  closeCreate: () => void;
  selectedUser: User | null;
  lockAction: "lock" | "unlock";
  showDetailDialog: boolean;
  showLockDialog: boolean;
  showCreateDialog: boolean;
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [lockAction, setLockAction] = useState<"lock" | "unlock">("lock");

  // timeout ref for delayed clearing of selectedUser
  const clearSelectedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clearSelectedTimeoutRef.current) {
        clearTimeout(clearSelectedTimeoutRef.current);
        clearSelectedTimeoutRef.current = null;
      }
    };
  }, []);

  const openDetail = (user: User) => {
    // If there is a pending clear timeout, cancel it (we're reopening)
    if (clearSelectedTimeoutRef.current) {
      clearTimeout(clearSelectedTimeoutRef.current);
      clearSelectedTimeoutRef.current = null;
    }
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const closeDetail = () => {
    // Hide the dialog immediately (trigger close animation)
    setShowDetailDialog(false);

    // Delay clearing selectedUser until after close animation completes
    // Adjust delay to match your dialog animation duration (250ms is a typical value)
    if (clearSelectedTimeoutRef.current) {
      clearTimeout(clearSelectedTimeoutRef.current);
    }
    clearSelectedTimeoutRef.current = window.setTimeout(() => {
      setSelectedUser(null);
      clearSelectedTimeoutRef.current = null;
    }, 250);
  };

  const openLock = (user: User, action: "lock" | "unlock") => {
    // same pattern: cancel pending clear so lock dialog can use selectedUser
    if (clearSelectedTimeoutRef.current) {
      clearTimeout(clearSelectedTimeoutRef.current);
      clearSelectedTimeoutRef.current = null;
    }
    setSelectedUser(user);
    setLockAction(action);
    setShowLockDialog(true);
  };
  const closeLock = () => {
    setShowLockDialog(false);
    // delay clearing so other modals/animations can finish if needed
    if (clearSelectedTimeoutRef.current) {
      clearTimeout(clearSelectedTimeoutRef.current);
    }
    clearSelectedTimeoutRef.current = window.setTimeout(() => {
      setSelectedUser(null);
      clearSelectedTimeoutRef.current = null;
    }, 250);
  };

  const openCreate = () => {
    setShowCreateDialog(true);
  };
  const closeCreate = () => {
    setShowCreateDialog(false);
  };

  return (
    <UsersModalContext.Provider
      value={{
        openDetail,
        openLock,
        openCreate,
        closeDetail,
        closeLock,
        closeCreate,
        selectedUser,
        lockAction,
        showDetailDialog,
        showLockDialog,
        showCreateDialog,
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
