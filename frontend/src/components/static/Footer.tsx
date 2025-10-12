import Link from "next/link"
import { Heart, Mail, MapPin, Phone, Facebook, Instagram, Youtube } from "lucide-react"
import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Heart className={styles.logoIconSvg} fill="currentColor" />
              </div>
              <span className={styles.brandName}>UETVolunteer</span>
            </Link>
            <p className={styles.brandDescription}>
              Kết nối yêu thương, lan tỏa giá trị nhân văn thông qua các hoạt động tình nguyện ý nghĩa.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Liên kết nhanh</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.link}>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/activities" className={styles.link}>
                  Hoạt động
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className={styles.link}>
                  Đăng ký tình nguyện
                </Link>
              </li>
              <li>
                <Link href="/donate" className={styles.link}>
                  Đóng góp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span className={styles.contactText}>
                  Đại học Công nghệ, Đại học Quốc gia Hà Nội, 144 Xuân Thủy, Cầu Giấy, Hà Nội
                </span>
              </li>
              <li className={styles.contactItemCenter}>
                <Phone className={styles.contactIconCenter} />
                <span className={styles.contactText}>024 3754 7461</span>
              </li>
              <li className={styles.contactItemCenter}>
                <Mail className={styles.contactIconCenter} />
                <a href="mailto:contact@uetvolunteer.vn" className={styles.contactLink}>
                  contact@uetvolunteer.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Kết nối với chúng tôi</h3>
            <div className={styles.socialButtons}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                <Facebook className={styles.socialIcon} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                <Instagram className={styles.socialIcon} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                <Youtube className={styles.socialIcon} />
                <span className="sr-only">Youtube</span>
              </a>
            </div>
            <p className={styles.socialDescription}>
              Theo dõi chúng tôi để cập nhật các hoạt động tình nguyện mới nhất!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>© {new Date().getFullYear()} UETVolunteer. Mọi quyền được bảo lưu.</p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.link}>
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className={styles.link}>
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
