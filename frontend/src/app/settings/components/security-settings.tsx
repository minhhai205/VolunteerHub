"use client";

import { useState, useEffect } from "react";
import styles from "./security-settings.module.css";
import SettingSection from "./setting-section";
import { Eye, EyeOff, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { toastManager } from "@/components/static/toast/toast";
import { clearTokens, getAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";

interface DeviceInfo {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  loginTime: number;
  ipAddress?: string;
  isCurrent: boolean;
}

const getDeviceInfo = (): Omit<
  DeviceInfo,
  "id" | "loginTime" | "isCurrent"
> => {
  const userAgent = navigator.userAgent;

  // Detect Browser
  let browser = "Unknown Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    browser = "Chrome";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR"))
    browser = "Opera";

  // Detect OS
  let os = "Unknown OS";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    os = "iOS";

  // Detect Device Type
  let deviceName = "Desktop";
  if (/Mobile|Android|iPhone/i.test(userAgent)) deviceName = "Mobile";
  else if (/iPad|Tablet/i.test(userAgent)) deviceName = "Tablet";

  return { deviceName, browser, os };
};

const getDeviceIcon = (deviceName: string) => {
  if (deviceName === "Mobile") return <Smartphone size={20} />;
  if (deviceName === "Tablet") return <Tablet size={20} />;
  return <Monitor size={20} />;
};

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Vừa xong";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} ngày trước`;
  return `${Math.floor(seconds / 2592000)} tháng trước`;
};

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");

  const router = useRouter();

  // Load devices từ localStorage khi component mount
  useEffect(() => {
    loadDevices();

    // Lưu thông tin device hiện tại khi user đăng nhập
    const accessToken = getAccessToken();
    if (accessToken) {
      saveCurrentDevice();
    }
  }, []);

  const loadDevices = () => {
    try {
      const savedDevices = localStorage.getItem("loginDevices");
      if (savedDevices) {
        const parsedDevices: DeviceInfo[] = JSON.parse(savedDevices);
        setDevices(parsedDevices);
      }
    } catch (err) {
      console.error("Error loading devices:", err);
    }
  };

  const saveCurrentDevice = () => {
    try {
      const deviceInfo = getDeviceInfo();
      const savedDevices = localStorage.getItem("loginDevices");
      let devices: DeviceInfo[] = savedDevices ? JSON.parse(savedDevices) : [];

      // Tạo device ID duy nhất dựa trên browser + OS
      const deviceId = `${deviceInfo.browser}-${deviceInfo.os}-${Date.now()}`;

      // Đánh dấu tất cả devices khác là không phải current
      devices = devices.map((d) => ({ ...d, isCurrent: false }));

      // Kiểm tra xem device này đã tồn tại chưa (cùng browser + OS)
      const existingDeviceIndex = devices.findIndex(
        (d) => d.browser === deviceInfo.browser && d.os === deviceInfo.os
      );

      const newDevice: DeviceInfo = {
        id: deviceId,
        ...deviceInfo,
        loginTime: Date.now(),
        isCurrent: true,
      };

      if (existingDeviceIndex !== -1) {
        // Cập nhật thời gian đăng nhập nếu device đã tồn tại
        devices[existingDeviceIndex] = newDevice;
      } else {
        // Thêm device mới
        devices.unshift(newDevice);
      }

      // Giới hạn chỉ lưu 10 devices gần nhất
      if (devices.length > 10) {
        devices = devices.slice(0, 10);
      }

      localStorage.setItem("loginDevices", JSON.stringify(devices));
      setDevices(devices);
      setCurrentDeviceId(deviceId);
    } catch (err) {
      console.error("Error saving device:", err);
    }
  };

  const removeDevice = (deviceId: string) => {
    try {
      const updatedDevices = devices.filter((d) => d.id !== deviceId);
      localStorage.setItem("loginDevices", JSON.stringify(updatedDevices));
      setDevices(updatedDevices);
      toastManager.success("Đã xóa thiết bị");
    } catch (err) {
      console.error("Error removing device:", err);
      toastManager.error("Không thể xóa thiết bị");
    }
  };

  const logoutAllDevices = () => {
    try {
      localStorage.removeItem("loginDevices");
      setDevices([]);
      clearTokens();
      toastManager.success("Đã đăng xuất tất cả thiết bị");
      router.push("/auth/login");
    } catch (err) {
      console.error("Error logging out devices:", err);
      toastManager.error("Không thể đăng xuất");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      toastManager.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      toastManager.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      toastManager.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);

      const accessToken = getAccessToken();

      if (!accessToken) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }
      if (data.status !== 200) {
        throw new Error(data.message || "Đổi mật khẩu thất bại");
      }
      toastManager.success(
        "Đổi mật khẩu thành công!, hãy tiến hành đăng nhập lại"
      );
      setSuccess("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      clearTokens();
      router.push("/auth/login");
    } catch (err) {
      console.log(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.securitySettings}>
      <h1 className={styles.title}>Cài Đặt Bảo Mật</h1>
      <p className={styles.description}>
        Quản lý các cài đặt bảo mật tài khoản của bạn
      </p>

      <SettingSection
        title="Đổi Mật Khẩu"
        description="Cập nhật mật khẩu tài khoản của bạn"
      >
        <form className={styles.passwordForm} onSubmit={handleChangePassword}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu hiện tại</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                className={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu mới</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Xác nhận mật khẩu</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Lưu Mật Khẩu"}
          </button>
        </form>
      </SettingSection>

      <SettingSection
        title="Các Thiết Bị Đã Đăng Nhập"
        description={`Bạn đang đăng nhập trên ${devices.length} thiết bị`}
      >
        <div className={styles.deviceList}>
          {devices.length === 0 ? (
            <div className={styles.noDevices}>
              <p>Chưa có thiết bị nào được lưu</p>
            </div>
          ) : (
            <>
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`${styles.deviceItem} ${
                    device.isCurrent ? styles.currentDevice : ""
                  }`}
                >
                  <div className={styles.deviceIcon}>
                    {getDeviceIcon(device.deviceName)}
                  </div>
                  <div className={styles.deviceInfo}>
                    <div className={styles.deviceHeader}>
                      <span className={styles.deviceName}>
                        {device.browser} on {device.os}
                        {device.isCurrent && (
                          <span className={styles.currentBadge}>
                            Thiết bị này
                          </span>
                        )}
                      </span>
                      {!device.isCurrent && (
                        <button
                          className={styles.removeButton}
                          onClick={() => removeDevice(device.id)}
                          title="Xóa thiết bị"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <span className={styles.deviceTime}>
                      Đăng nhập lần cuối: {formatTimeAgo(device.loginTime)}
                    </span>
                    <span className={styles.deviceType}>
                      {device.deviceName}
                    </span>
                  </div>
                </div>
              ))}

              {devices.length > 1 && (
                <button
                  className={styles.logoutAllButton}
                  onClick={logoutAllDevices}
                >
                  Đăng xuất tất cả thiết bị
                </button>
              )}
            </>
          )}
        </div>
      </SettingSection>
    </div>
  );
}
