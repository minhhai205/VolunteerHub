import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Heart
              className="h-5 w-5 text-primary-foreground"
              fill="currentColor"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            UETVolunteer
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Về chúng tôi
          </Link>
          <Link
            href="/activities"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Hoạt động
          </Link>
          <Link
            href="/volunteer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tình nguyện
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Liên hệ
          </Link>
        </nav>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex">
            Đóng góp
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
