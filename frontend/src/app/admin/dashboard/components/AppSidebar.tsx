"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  User2,
  ChevronUp,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { getName } from "@/lib/getDataFromToken";

const items = [
  {
    title: "Trang chủ",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Sự kiện",
    url: "/admin/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Quản lí người dùng",
    url: "/admin/dashboard/users",
    icon: User,
  },
];

const AppSidebar = () => {
  const pathname = usePathname() || "";
  const [userName, setUserName] = useState<string>("Tài khoản");

  useEffect(() => {
    const name = getName();
    if (name) setUserName(name);
  }, []);

  const isItemActive = (itemUrl: string) => {
    if (itemUrl === "/admin/dashboard") {
      return pathname === itemUrl;
    }
    return pathname.startsWith(itemUrl);
  };

  return (
    <Sidebar collapsible="icon" className="text-xl">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-xl">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src="/UET.svg.png"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="mr-2"
                />
                <span>UETVolunteer</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const active = isItemActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`text-lg ${
                        active
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      } rounded px-2 py-1`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 text-inherit"
                      >
                        <item.icon className="flex-shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-lg">
                  <User2 /> {userName} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem>Tài khoản</DropdownMenuItem>
                <DropdownMenuItem>Cài đặt</DropdownMenuItem> */}
                <DropdownMenuItem variant="destructive">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
