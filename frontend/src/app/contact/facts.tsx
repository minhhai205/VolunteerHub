import styles from "./facts.module.css";

const factsData = [
  {
    emoji: "🌿",
    fact: "Mỗi tình nguyện viên được phép có 1 cây xanh được trồng tại trụ sở",
  },
  {
    emoji: "☕",
    fact: "Chúng tôi uống gần 1,000 cốc cà phê xanh (theo chủ đề) mỗi tháng!",
  },
  {
    emoji: "📚",
    fact: '87% tình nguyện viên của chúng tôi có biệt danh "xanh" hoặc tên có liên quan',
  },
  {
    emoji: "🎂",
    fact: "Kỷ niệm thành lập là 15/3 - ngày chuyên biệt chăm sóc cây xanh",
  },
  {
    emoji: "🏆",
    fact: "Chúng tôi thắng 5 giải thưởng có logo xanh lá cây trong năm qua",
  },
  {
    emoji: "🎵",
    fact: "Bài ca tình nguyện của chúng tôi có 95% từ vựng liên quan đến thiên nhiên",
  },
];

export default function Facts() {
  return (
    <section className={styles.facts}>
      <div className={styles.container}>
        <h2 className={styles.title}>Những Fact Vui Vẻ</h2>
        <div className={styles.factsGrid}>
          {factsData.map((item, index) => (
            <div key={index} className={styles.factCard}>
              <div className={styles.factEmoji}>{item.emoji}</div>
              <p className={styles.factText}>{item.fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
