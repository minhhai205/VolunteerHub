import styles from "./map.module.css";

export default function Map() {
  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Vị Trí Làm Việc</h2>
        <p className={styles.subtitle}>
          Ghé thăm trụ sở chính của chúng tôi tại địa chỉ dưới đây
        </p>

        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8204176594476!2d105.79752577619025!3d21.04821468058288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab01d131dcd1%3A0x789e4d10221c3b0!2zVHLGsOG7nW5nIENvbGxlZ2Ugb2YgRWNvbm9taWNzLCBUcmFkaW5nIGFuZCBUb3VyaXNt!5e0!3m2!1svi!2s!4v1700000000000"
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: "15px" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className={styles.addressCard}>
          <h3 className={styles.addressTitle}>📍 Trụ Sở Chính</h3>
          <p className={styles.addressText}>
            Số 1, Phố Xã Đàn, Quận Hoàn Kiếm, Hà Nội
            <br />
            <strong>Điện thoại:</strong> (024) 3829-5555
            <br />
            <strong>Email:</strong> info@tinhnguyen.org.vn
            <br />
            <strong>Giờ hoạt động:</strong> Thứ Hai - Chủ Nhật, 08:00 - 17:00
          </p>
        </div>
      </div>
    </section>
  );
}
