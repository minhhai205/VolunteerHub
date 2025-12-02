import Image from "next/image";
import styles from "./member-card.module.css";

interface Member {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  contact: string;
  phone: string;
}

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={member.avatar || "/placeholder.svg"}
          alt={member.name}
          width={200}
          height={200}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>
        <p className={styles.bio}>{member.bio}</p>
        <div className={styles.contactInfo}>
          <p>
            <span className={styles.label}>📧</span>
            <a href={`mailto:${member.contact}`}>{member.contact}</a>
          </p>
          <p>
            <span className={styles.label}>📱</span>
            <a href={`tel:${member.phone}`}>{member.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
