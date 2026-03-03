import styles from "./create-event.module.css";
import { CreateEventForm } from "./components/create-event-form";

export default function CreateEventPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Tạo sự kiện tình nguyện mới</h1>
            <p className={styles.subtitle}>
              Điền thông tin chi tiết về sự kiện để thu hút tình nguyện viên
              tham gia
            </p>
          </div>
          <CreateEventForm />
        </div>
      </main>
    </div>
  );
}
