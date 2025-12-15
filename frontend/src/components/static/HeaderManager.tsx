"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/token";

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showManagementMenu, setShowManagementMenu] = useState(false);
  const [user, setUser] = useState({
    name: "",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  });

  // Kiểm tra accessToken khi component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      setIsLoggedIn(true);

      // Lấy thông tin user từ localStorage hoặc decode từ token
      const userName = localStorage.getItem("userName") || "User";
      const userAvatar =
        localStorage.getItem("userAvatar") ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

      setUser({
        name: userName,
        avatar: userAvatar,
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        alert("Không tìm thấy token. Vui lòng đăng nhập lại!");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      // Gọi API logout với DTO
      const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      });

      const data = await response.json();

      // Kiểm tra status = 200 thì mới logout
      if (response.status === 200 || data.status === 200) {
        // Xóa accessToken và thông tin user khỏi localStorage
        clearTokens();
        localStorage.removeItem("userName");
        localStorage.removeItem("userAvatar");

        setIsLoggedIn(false);
        setShowUserMenu(false);

        // Redirect về trang chủ
        window.location.href = "/auth/login";
      } else {
        // Xử lý khi logout thất bại
        console.error("Logout failed:", data);
        alert("Đăng xuất thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!");
    }
  };

  // Helper function để kiểm tra active link
  const isActive = (paths: string | string[]) => {
    const pathArray = Array.isArray(paths) ? paths : [paths];

    return pathArray.some((path) => {
      if (path === "/home") {
        return pathname === "/home" || pathname === "/";
      }
      return pathname.startsWith(path);
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and Brand */}
        <Link href="/manager/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Heart className={styles.logoIconSvg} fill="currentColor" />
          </div>
          <span className={styles.brandName}>UET Volunteer</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link
            href="/manager/dashboard"
            className={`${styles.navLink} ${
              isActive("/manager/dashboard") ? styles.navLinkActive : ""
            }`}
          >
            Tổng quan
          </Link>
          <Link
            href="/manager/event/list"
            className={`${styles.navLink} ${
              isActive(["/manager/event", "/event"]) ? styles.navLinkActive : ""
            }`}
          >
            Sự kiện
          </Link>

          {/* Dropdown Menu cho Quản lý */}
          <div className={styles.dropdownWrapper}>
            <button
              className={`${styles.navLink} ${styles.navLinkDropdown} ${
                isActive([
                  "/manager/request",
                  "/manager/member",
                  "/manager/create-request",
                ])
                  ? styles.navLinkActive
                  : ""
              }`}
              onClick={() => setShowManagementMenu(!showManagementMenu)}
              onMouseEnter={() => setShowManagementMenu(true)}
            >
              Quản lý
              <ChevronDown size={16} className={styles.chevronIcon} />
            </button>

            {showManagementMenu && (
              <div
                className={styles.managementDropdown}
                onMouseLeave={() => setShowManagementMenu(false)}
              >
                <Link
                  href="/manager/request"
                  className={`${styles.managementItem} ${
                    isActive("/manager/request")
                      ? styles.managementItemActive
                      : ""
                  }`}
                  onClick={() => setShowManagementMenu(false)}
                >
                  Quản lý đăng ký
                </Link>
                <Link
                  href="/manager/member"
                  className={`${styles.managementItem} ${
                    isActive("/manager/member")
                      ? styles.managementItemActive
                      : ""
                  }`}
                  onClick={() => setShowManagementMenu(false)}
                >
                  Quản lý đánh giá
                </Link>
                <Link
                  href="/manager/create-request"
                  className={`${styles.managementItem} ${
                    isActive("/manager/create-request")
                      ? styles.managementItemActive
                      : ""
                  }`}
                  onClick={() => setShowManagementMenu(false)}
                >
                  Yêu cầu tạo sự kiện
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`${styles.navLink} ${
              isActive("/contact") ? styles.navLinkActive : ""
            }`}
          >
            Liên hệ
          </Link>
        </nav>

        {/* CTA and Mobile Menu */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link href="/auth/login">
              <Button className={styles.ctaButton}>Đăng nhập</Button>
            </Link>
          ) : (
            <div className={styles.userInfoWrapper}>
              <span className={styles.userName}>{user.name}</span>

              <div className={styles.userMenuContainer}>
                <button
                  className={styles.avatarButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.userAvatar}
                  />
                </button>

                {showUserMenu && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      href="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                      href="/settings"
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={18} />
                      <span>Cài đặt</span>
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button variant="ghost" size="icon" className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
