import styles from "./update-event.module.css";
import { Footer } from "@/components/static/Footer";
import { UpdateEventForm } from "./components/update-event-form";
import { Header } from "@/components/static/HeaderManager";

export default async function UpdateEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Cập nhật sự kiện tình nguyện</h1>
            <p className={styles.subtitle}>Mã số của sự kiện: {eventId}</p>
          </div>
          <UpdateEventForm eventId={eventId} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
