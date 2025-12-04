import styles from "./team.module.css";
import MemberCard from "./member-card";

const teamData = [
  {
    id: 1,
    name: "Vũ Minh Hiến",
    role: "Sinh viên năm 3",
    bio: "40 năm kinh nghiệm trong lĩnh vực phát triển cộng đồng",
    avatar:
      "https://scontent-hkg4-2.xx.fbcdn.net/v/t39.30808-1/575196221_1346412046980149_4499180069325775097_n.jpg?stp=c0.0.1170.1170a_dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHo-3qFg33QyupPk5MUHXIk-pWQ6c4i2s36lZDpziLazXx8rghqMuRZaqNUhpdjovR5kKheWNr8oNotjo1iYf0F&_nc_ohc=cn-W4IlbqYMQ7kNvwEzSUBQ&_nc_oc=AdkNFsGl-hm4lJN1HLGvPNgWVJyVmA4r9_FJiUmWLa6FwBbq_cFEM_A6WJ-_Ckvh0E8qo-cPaimfcGfxoPnvGPHs&_nc_zt=24&_nc_ht=scontent-hkg4-2.xx&_nc_gid=T7Snu1gJM0v7IFNNQYVLbg&oh=00_Afl5GKmSeYkLhJufpzKKF8iobAmrUxIjTT-7ZXlc58O73Q&oe=6935033B",
    contact: "hvu6582@gmail.com",
    phone: "0987.654.321",
  },
  {
    id: 2,
    name: "Nguyễn Trung Đức",
    role: "Sinh viên năm 3",
    bio: "50 năm kinh nghiệm trong lĩnh vực phát triển cộng đồng",
    avatar:
      "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/165935/Originals/batch_chia-se-bo-30-hinh-nen-naruto-doc-la-cho-dien-thoai-may-tinh-11.jpg",
    contact: "duc@tinhnguyen.org.vn",
    phone: "0988.765.432",
  },
  {
    id: 3,
    name: "Nguyễn Minh Hải",
    role: "Phó Trưởng - Chương Trình Môi Trường",
    bio: "Người tiên phong trong các dự án bảo vệ môi trường",
    avatar:
      "https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-1/580920433_801171536151217_1372406913293032244_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHPjBtrrrQLTmDWtdibpU7soBIbpqAanJGgEhumoBqckfv1yZ3MuUd4Z34iexRHF3JP4oQPigtmMM6toVMDPEP7&_nc_ohc=shLUB-rmt2MQ7kNvwEwNCGk&_nc_oc=AdmQ-DpBwv5xpwvC5gIOOmdVwHwMZmb6NtCbxjujZxNKE6cTDufvjgpd_F0h_02PTIlhN5BwQ6sO70FEPTnfp4WB&_nc_zt=24&_nc_ht=scontent-hkg1-1.xx&_nc_gid=0eYcJO-isCwaotpQ8tuCXg&oh=00_AfnBsFQl1a21pvtSuYxlWPiymMf-pmLEjsBmgUnX4aig0A&oe=6934D6B2",
    contact: "hai@tinhnguyen.org.vn",
    phone: "0989.876.543",
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
