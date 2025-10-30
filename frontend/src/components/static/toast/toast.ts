// src/components/toast/toast.ts
export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners = new Set<ToastListener>();
  private nextId = 0;

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb([...this.toasts]));
  }

  private addToast(
    message: string,
    type: ToastType = "info",
    duration = 4000
  ): string {
    const id = `toast-${this.nextId++}`;
    const toast: ToastMessage = { id, message, type, duration };
    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }

    return id;
  }

  success(message: string, duration?: number) {
    return this.addToast(message, "success", duration);
  }

  error(message: string, duration?: number) {
    return this.addToast(message, "error", duration);
  }

  warning(message: string, duration?: number) {
    return this.addToast(message, "warning", duration);
  }

  info(message: string, duration?: number) {
    return this.addToast(message, "info", duration);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clearAll() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();
