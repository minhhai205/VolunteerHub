import { EventStats } from "./components/event-stats";
import { NewEventsSection } from "./components/new-events-section";
import { TrendingEventsSection } from "./components/trending-events-section";
import { RecentPostsSection } from "./components/recent-posts-section";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Quản lý sự kiện và tình nguyện viên của bạn
          </p>
        </div>

        <EventStats />
        <div className={styles.gridLayout}>
          <div className={styles.leftColumn}>
            <NewEventsSection />
            <TrendingEventsSection />
          </div>
          <RecentPostsSection />
        </div>
      </main>
    </div>
  );
}
