"use client";

// app/users/page.tsx
import { redirect } from "next/navigation";

export default function UsersRootPage() {
  redirect("users/volunteers");
}
