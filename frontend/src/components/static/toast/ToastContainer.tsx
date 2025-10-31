// src/components/toast/ToastContainer.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import "./toast.css";
import { toastManager, type ToastMessage } from "./toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleClose = useCallback((id: string) => {
    toastManager.removeToast(id);
  }, []);

  return (
    <div className="toasts-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => handleClose(toast.id)}
        >
          <div className="icon">
            {toast.type === "success" && "✔️"}
            {toast.type === "error" && "❌"}
            {toast.type === "info" && "ℹ️"}
            {toast.type === "warning" && "⚠️"}
          </div>
          <div className="msg">{toast.message}</div>
        </div>
      ))}
    </div>
  );
}
