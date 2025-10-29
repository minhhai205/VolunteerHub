"use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { mockUsers, type User } from "@/lib/mockData";
// import { Search, Users, UserCog } from "lucide-react";
// import { toast } from "sonner";
// import { generatePaginationItems } from "@/lib/pagination";

// import UserCard from "./components/UserCard";
// import UserDetailDialog from "./components/UserDetailDialog";
// import LockDialog from "./components/LockDialog";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>(mockUsers);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showDetailDialog, setShowDetailDialog] = useState(false);
//   const [showLockDialog, setShowLockDialog] = useState(false);
//   const [lockAction, setLockAction] = useState<"lock" | "unlock">("lock");
//   const [volunteerPage, setVolunteerPage] = useState(1);
//   const [managerPage, setManagerPage] = useState(1);
//   const volunteerTotalPages = 10; // Giả sử có 10 trang cho tình nguyện viên

//   const volunteers = users.filter((user) => user.role === "volunteer");
//   const eventManagers = users.filter((user) => user.role === "event_manager");

//   // dynamic things

//   const filterUsers = (userList: User[]) =>
//     userList.filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const filteredVolunteers = filterUsers(volunteers);
//   const filteredEventManagers = filterUsers(eventManagers);

//   const handleLockToggle = () => {
//     if (selectedUser) {
//       const newStatus = lockAction === "lock" ? "locked" : "active";
//       setUsers(
//         users.map((u) =>
//           u.id === selectedUser.id
//             ? { ...u, status: newStatus as User["status"] }
//             : u
//         )
//       );
//       toast(
//         lockAction === "lock" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
//         {
//           description:
//             lockAction === "lock"
//               ? "Người dùng không thể đăng nhập vào hệ thống"
//               : "Người dùng có thể đăng nhập trở lại",
//         }
//       );
//       setShowLockDialog(false);
//       setSelectedUser(null);
//     }
//   };

//   const getRoleBadge = (role: User["role"]) => {
//     switch (role) {
//       case "admin":
//         return (
//           <Badge className="bg-primary text-primary-foreground">
//             Quản trị viên
//           </Badge>
//         );
//       case "event_manager":
//         return (
//           <Badge className="bg-accent text-accent-foreground">
//             Quản lý sự kiện
//           </Badge>
//         );
//       case "volunteer":
//         return <Badge variant="secondary">Tình nguyện viên</Badge>;
//     }
//   };

//   const getStatusBadge = (status: User["status"]) =>
//     status === "active" ? (
//       <Badge className="bg-accent text-accent-foreground">Hoạt động</Badge>
//     ) : (
//       <Badge variant="destructive">Đã khóa</Badge>
//     );

//   return (
//     <div className="flex h-screen bg-background">
//       <div className="flex flex-1 flex-col">
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-8">
//             <div className="mb-8">
//               <h1 className="text-3xl font-semibold text-foreground">
//                 Quản lý người dùng
//               </h1>
//               <p className="text-muted-foreground">
//                 Xem và quản lý tài khoản tình nguyện viên và quản lý sự kiện
//               </p>
//             </div>

//             <Card className="mb-6">
//               <CardContent>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input
//                     placeholder="Tìm kiếm người dùng..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Tabs defaultValue="volunteers" className="space-y-6">
//               <TabsList className="grid w-full max-w-md grid-cols-2">
//                 <TabsTrigger
//                   value="volunteers"
//                   className="flex items-center gap-2"
//                 >
//                   <Users className="h-4 w-4" />
//                   Tình nguyện viên ({volunteers.length})
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="managers"
//                   className="flex items-center gap-2"
//                 >
//                   <UserCog className="h-4 w-4" />
//                   Quản lý sự kiện ({eventManagers.length})
//                 </TabsTrigger>
//               </TabsList>

//               {/* volunteer tab */}
//               <TabsContent value="volunteers" className="space-y-4">
//                 {filteredVolunteers.map((user) => (
//                   <UserCard
//                     key={user.id}
//                     user={user}
//                     // getRoleBadge={getRoleBadge}
//                     // getStatusBadge={getStatusBadge}
//                     onShowDetail={(u) => {
//                       setSelectedUser(u);
//                       setShowDetailDialog(true);
//                     }}
//                     onRequestLock={(u, action) => {
//                       setSelectedUser(u);
//                       setLockAction(action);
//                       setShowLockDialog(true);
//                     }}
//                   />
//                 ))}
//                 {filteredVolunteers.length === 0 && (
//                   <Card>
//                     <CardContent className="p-12 text-center">
//                       <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
//                       <p className="text-muted-foreground">
//                         Không tìm thấy tình nguyện viên nào
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Pagination for volunteers */}
//                 {filteredVolunteers.length > 0 && (
//                   <div className="mt-6 border-t border-border pt-6">
//                     <Pagination>
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious
//                             href="#"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               if (volunteerPage > 1)
//                                 setVolunteerPage(volunteerPage - 1);
//                             }}
//                             className={
//                               volunteerPage === 1
//                                 ? "pointer-events-none opacity-50"
//                                 : ""
//                             }
//                           />
//                         </PaginationItem>

//                         {generatePaginationItems(
//                           volunteerPage,
//                           volunteerTotalPages
//                         ).map((item, index) => (
//                           <PaginationItem key={index}>
//                             {item === "ellipsis" ? (
//                               <PaginationEllipsis />
//                             ) : (
//                               <PaginationLink
//                                 href="#"
//                                 isActive={item === volunteerPage}
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   setVolunteerPage(item as number);
//                                 }}
//                               >
//                                 {item}
//                               </PaginationLink>
//                             )}
//                           </PaginationItem>
//                         ))}

//                         <PaginationItem>
//                           <PaginationNext
//                             href="#"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               if (volunteerPage < volunteerTotalPages)
//                                 setVolunteerPage(volunteerPage + 1);
//                             }}
//                             className={
//                               volunteerPage === volunteerTotalPages
//                                 ? "pointer-events-none opacity-50"
//                                 : ""
//                             }
//                           />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   </div>
//                 )}
//               </TabsContent>

//               {/* event manager tab */}
//               <TabsContent value="managers" className="space-y-4">
//                 {filteredEventManagers.map((user) => (
//                   <UserCard
//                     key={user.id}
//                     user={user}
//                     // getRoleBadge={getRoleBadge}
//                     // getStatusBadge={getStatusBadge}
//                     onShowDetail={(u) => {
//                       setSelectedUser(u);
//                       setShowDetailDialog(true);
//                     }}
//                     onRequestLock={(u, action) => {
//                       setSelectedUser(u);
//                       setLockAction(action);
//                       setShowLockDialog(true);
//                     }}
//                   />
//                 ))}

//                 {filteredEventManagers.length === 0 && (
//                   <Card>
//                     <CardContent className="p-12 text-center">
//                       <UserCog className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
//                       <p className="text-muted-foreground">
//                         Không tìm thấy quản lý sự kiện nào
//                       </p>
//                     </CardContent>
//                   </Card>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </main>

//         <UserDetailDialog
//           open={showDetailDialog}
//           onOpenChange={setShowDetailDialog}
//           user={selectedUser}
//           getRoleBadge={getRoleBadge}
//           getStatusBadge={getStatusBadge}
//         />

//         <LockDialog
//           open={showLockDialog}
//           onOpenChange={setShowLockDialog}
//           user={selectedUser}
//           lockAction={lockAction}
//           onConfirm={handleLockToggle}
//         />
//       </div>
//     </div>
//   );
// }

// app/users/page.tsx
import { redirect } from "next/navigation";

export default function UsersRootPage() {
  redirect("users/volunteers");
}
