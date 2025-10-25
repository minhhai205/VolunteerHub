"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserCog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <header>
            <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
            <p className="text-muted-foreground">
              Xem và quản lý tài khoản tình nguyện viên và quản lý sự kiện
            </p>
          </header>

          {/* search bar */}
          <Card>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* tabs navigation */}
          <Tabs
            value={pathname.includes("managers") ? "managers" : "volunteers"}
            onValueChange={(val) => router.push(`${val}`)}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="volunteers"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Tình nguyện viên
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" /> Quản lý sự kiện
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* tab content */}
          {children}
        </main>
      </div>
    </div>
  );
}
