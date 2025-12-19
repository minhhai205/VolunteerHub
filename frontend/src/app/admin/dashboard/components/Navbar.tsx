"use client";

import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NotificationsDropdown } from "./Notification";
import { useLogout } from "../hooks/useLogout";
import { useState, useEffect } from "react";
import { getName } from "@/lib/getDataFromToken";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { logout, isLoading } = useLogout();

  const [userName, setUserName] = useState<string>("Tên tài khoản");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://avatars.githubusercontent.com/u/1486366"
  );

  useEffect(() => {
    const name = getName();
    if (name) setUserName(name);
    const stored = localStorage.getItem("userAvatar");
    if (stored) setAvatarUrl(stored);
  }, []);

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10">
      {/* LEFT */}
      <SidebarTrigger />
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <NotificationsDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{initials(userName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Hồ sơ
            </DropdownMenuItem> */}
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
