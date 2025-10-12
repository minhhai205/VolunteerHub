import Link from "next/link"
import { Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "./Header.module.css"

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo and Brand */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Heart className={styles.logoIconSvg} fill="currentColor" />
          </div>
          <span className={styles.brandName}>UET Volunteer</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/home" className={styles.navLink}>
            Trang chủ
          </Link>
          <Link href="/event/list" className={styles.navLink}>
            Sự kiện
          </Link>
          <Link href="/activity" className={styles.navLink}>
            Hoạt động
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Liên hệ
          </Link>
        </nav>

        {/* CTA and Mobile Menu */}
        <div className={styles.actions}>
          <Button className={styles.ctaButton}>Đăng nhập</Button>
          <Button variant="ghost" size="icon" className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
