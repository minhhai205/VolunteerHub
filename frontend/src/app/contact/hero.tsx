import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Liên Hệ Với Chúng Tôi</h1>
        <p className={styles.heroDescription}>
          Chúng tôi luôn sẵn sàng lắng nghe và hợp tác để tạo nên những thay đổi
          tích cực trong cộng đồng
        </p>
      </div>
      <div className={styles.heroDecor}></div>
    </section>
  );
}
