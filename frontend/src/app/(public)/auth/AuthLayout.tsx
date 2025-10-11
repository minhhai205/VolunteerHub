import type React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import "./style.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              VolunteerHub
            </span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {subtitle}
            </p>
          </div>

          {/* Form */}
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative bg-muted">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium text-balance leading-relaxed">
              `Tình nguyện không chỉ là cho đi, mà còn là nhận lại niềm vui và ý
              nghĩa trong cuộc sống.`
            </p>
            <footer className="text-sm opacity-90">
              — Cộng đồng tình nguyện viên
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
