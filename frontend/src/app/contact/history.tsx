import styles from "./history.module.css";

const historyData = [
  {
    year: "2019",
    title: "Khởi Đầu Nhỏ",
    description:
      "Nhóm sinh viên vài người cùng nhau thực hiện những hoạt động tình nguyện đầu tiên tại trường đại học.",
  },
  {
    year: "2020",
    title: "Hình Thành Ý Tưởng",
    description:
      "Bắt đầu xây dựng dự án tình nguyện sinh viên với mục tiêu kết nối – hỗ trợ – lan tỏa giá trị tốt đẹp.",
  },
  {
    year: "2021",
    title: "Những Bước Đi Đầu Tiên",
    description:
      "Tổ chức các hoạt động gây quỹ, hỗ trợ lớp học miễn phí, và chiến dịch bảo vệ môi trường trong khuôn viên trường.",
  },
  {
    year: "2022",
    title: "Mở Rộng Cộng Đồng",
    description:
      "Thu hút hơn 100 bạn sinh viên tham gia thường xuyên và hợp tác với các CLB – đoàn trường.",
  },
  {
    year: "2023",
    title: "Định Hình Startup",
    description:
      "Chuyển đổi mô hình thành startup xã hội, phát triển nền tảng kết nối sinh viên với các dự án tình nguyện.",
  },
  {
    year: "2024",
    title: "Hiện Tại",
    description:
      "Cộng đồng hơn 300 thành viên hoạt động tích cực, hỗ trợ hàng chục dự án nhỏ mỗi năm và tạo không gian trải nghiệm ý nghĩa cho sinh viên.",
  },
];

export default function History() {
  return (
    <section className={styles.history}>
      <div className={styles.container}>
        <h2 className={styles.title}>Lịch Sử Phát Triển</h2>
        <div className={styles.timeline}>
          {historyData.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineYear}>{item.year}</div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
