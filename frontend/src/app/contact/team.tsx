import styles from "./team.module.css";
import MemberCard from "./member-card";

const teamData = [
  {
    id: 1,
    name: "Nguyễn Thị Hương",
    role: "Trưởng Trung Tâm",
    bio: "15 năm kinh nghiệm trong lĩnh vực phát triển cộng đồng",
    avatar: "/smiling-woman.png",
    contact: "huong@tinhnguyen.org.vn",
    phone: "0987.654.321",
  },
  {
    id: 2,
    name: "Trần Minh Đức",
    role: "Phó Trưởng - Chương Trình Giáo Dục",
    bio: "Chuyên gia giáo dục cộng đồng, tổ chức 50+ chương trình đào tạo",
    avatar: "/man-smiling.jpg",
    contact: "duc@tinhnguyen.org.vn",
    phone: "0988.765.432",
  },
  {
    id: 3,
    name: "Lê Thảo Vy",
    role: "Phó Trưởng - Chương Trình Môi Trường",
    bio: "Người tiên phong trong các dự án bảo vệ môi trường",
    avatar: "/woman-nature.jpg",
    contact: "vy@tinhnguyen.org.vn",
    phone: "0989.876.543",
  },
  {
    id: 4,
    name: "Phạm Anh Tuấn",
    role: "Phó Trưởng - Chương Trình Y Tế",
    bio: "Bác sĩ cộng đồng, hỗ trợ sức khỏe cho 5,000+ người hàng năm",
    avatar: "/man-doctor.jpg",
    contact: "tuan@tinhnguyen.org.vn",
    phone: "0990.987.654",
  },
];

export default function Team() {
  return (
    <section className={styles.team}>
      <div className={styles.container}>
        <h2 className={styles.title}>Đội Ngũ Tiêu Biểu</h2>
        <p className={styles.description}>
          Những người dẫn dắt các hoạt động và chương trình tình nguyện của
          chúng tôi
        </p>
        <div className={styles.teamGrid}>
          {teamData.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
