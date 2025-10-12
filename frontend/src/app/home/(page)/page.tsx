import { Header } from "@/components/static/Header"
import { Footer } from "@/components/static/Footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Target, Award, ArrowRight, Calendar } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Chào mừng đến với UET Volunteer</h1>
            <p className={styles.heroDescription}>
              Nơi kết nối những trái tim yêu thương, cùng nhau tạo nên những giá trị ý nghĩa cho cộng đồng.
            </p>
            <div className={styles.heroActions}>
              <Button size="lg" className={styles.heroPrimaryButton}>
                Tham gia ngay
                <ArrowRight className={styles.heroArrowIcon} />
              </Button>
              <Button size="lg" variant="outline">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Tình nguyện viên</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>120+</div>
                <div className={styles.statLabel}>Dự án hoàn thành</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Đối tác</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Người được giúp đỡ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <h2 className={styles.valuesTitle}>Giá trị cốt lõi</h2>
            <p className={styles.valuesDescription}>Những giá trị định hướng mọi hoạt động của chúng tôi</p>
          </div>

          <div className={styles.valuesGrid}>
            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Heart className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Yêu thương</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Lan tỏa tình yêu thương đến mọi người trong cộng đồng
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Users className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Đoàn kết</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Kết nối và hợp tác để tạo ra sức mạnh tập thể
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Target className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Trách nhiệm</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Cam kết thực hiện mọi hoạt động với tinh thần trách nhiệm cao
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Award className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Chất lượng</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Đảm bảo chất lượng trong từng hoạt động và dự án
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Activities Section */}
        <section className={styles.activitiesSection}>
          <div className={styles.activitiesContainer}>
            <div className={styles.activitiesHeader}>
              <h2 className={styles.activitiesTitle}>Hoạt động gần đây</h2>
              <p className={styles.activitiesDescription}>Những hoạt động từ thiện ý nghĩa mà chúng tôi đã thực hiện</p>
            </div>

            <div className={styles.activitiesGrid}>
              <Card className={styles.activityCard}>
                <CardHeader>
                  <div className={styles.activityImage}>
                    <Image
                      src="/images/home1.jpg"
                      alt="Hoạt động từ thiện"
                      className={styles.activityImageElement}
                      width={180}
                      height={38}
                    />
                  </div>
                  <CardTitle className={styles.activityTitle}>Trao học bổng cho học sinh nghèo</CardTitle>
                  <div className={styles.activityDate}>
                    <Calendar className={styles.activityDateIcon} />
                    <span>15/03/2024</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className={styles.activityDescription}>
                    Trao 50 suất học bổng cho học sinh có hoàn cảnh khó khăn tại vùng cao
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={styles.activityCard}>
                <CardHeader>
                  <div className={styles.activityImage}>
                    <Image
                      src="/images/home2.jpg"
                      alt="Hoạt động từ thiện"
                      className={styles.activityImageElement}
                      width={180}
                      height={38}
                    />
                  </div>
                  <CardTitle className={styles.activityTitle}>Chăm sóc người cao tuổi</CardTitle>
                  <div className={styles.activityDate}>
                    <Calendar className={styles.activityDateIcon} />
                    <span>08/03/2024</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className={styles.activityDescription}>
                    Tổ chức hoạt động thăm hỏi và chăm sóc người cao tuổi tại viện dưỡng lão
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className={styles.activityCard}>
                <CardHeader>
                  <div className={styles.activityImage}>
                    <Image
                      src="/images/home3.jpg"
                      alt="Hoạt động từ thiện"
                      className={styles.activityImageElement}
                      width={180}
                      height={38}
                    />
                  </div>
                  <CardTitle className={styles.activityTitle}>Trồng cây xanh bảo vệ môi trường</CardTitle>
                  <div className={styles.activityDate}>
                    <Calendar className={styles.activityDateIcon} />
                    <span>01/03/2024</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className={styles.activityDescription}>
                    Trồng 200 cây xanh tại khu vực công viên và trường học trong khu vực
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Cùng chúng tôi tạo nên sự khác biệt</h2>
            <p className={styles.ctaDescription}>
              Mỗi hành động nhỏ đều có thể tạo nên những thay đổi lớn. Hãy tham gia cùng chúng tôi!
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" className={styles.ctaPrimaryButton}>
                Đăng ký tình nguyện
              </Button>
              <Button size="lg" variant="outline">
                Liên hệ với chúng tôi
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
