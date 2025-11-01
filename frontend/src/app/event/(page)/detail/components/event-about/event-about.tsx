"use client";

import type { Event } from "../../../../hooks/useDetail";
import styles from "./event-about.module.css";

interface EventAboutProps {
  event: Event;
}

export default function EventAbout({ event }: EventAboutProps) {
  return (
    <div className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Về sự kiện</h2>
        <p className={styles.description}>{event.description}</p>
      </div>
    </div>
  );
}
