// src/lib/notification.ts

const PUBLIC_VAPID_KEY =
  "BIrPFl6lvT6iF6J-oc1kkIy-Fciqz5aW9Ox7zsiwmlaEh3FjqPa_opGOacL4vze6pd4gbtslzFdF5ilwpq0sHec";
const API_BASE_URL = "http://localhost:8080";

/**
 * Convert base64 string to Uint8Array for VAPID key.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Đăng ký Push Notification sau khi login thành công.
 * @param token JWT token của người dùng.
 */
export async function registerPushAfterLogin(token: string): Promise<void> {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Trình duyệt không hỗ trợ Web Push.");
      return;
    }

    // Đăng ký Service Worker
    const registration: ServiceWorkerRegistration =
      await navigator.serviceWorker.register("/sw.js");
    console.log("[SW] Đã đăng ký:", registration);

    // Xin quyền hiển thị thông báo
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Bạn cần cho phép thông báo để nhận cập nhật!");
      return;
    }

    // Đăng ký với PushManager
    const keyArray = new Uint8Array(
      urlBase64ToUint8Array(PUBLIC_VAPID_KEY).buffer as ArrayBuffer
    );
    const subscription: PushSubscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyArray,
      });

    console.log("Subscription mới:", subscription);

    // Gửi subscription lên backend để lưu
    const res = await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    const data = await res.json();

    if (!data.status) {
      console.error("Lỗi khi lưu subscription:", data);
      throw new Error(data.message || "Không thể lưu subscription trên server");
    }

    console.log("Đã đăng ký nhận thông báo thành công!");
  } catch (error) {
    console.error("Lỗi khi đăng ký Push:", error);
  }
}
