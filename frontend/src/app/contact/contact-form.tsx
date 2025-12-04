"use client";

import type React from "react";

import { useState } from "react";
import styles from "./contact-form.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Gửi Thông Tin Cho Chúng Tôi</h2>
        <p className={styles.description}>
          Hãy để lại thông tin của bạn hoặc những câu hỏi, chúng tôi sẽ phản hồi
          trong 24 giờ
        </p>

        {submitted && (
          <div className={styles.successMessage}>
            ✅ Cảm ơn bạn! Chúng tôi đã nhận được thông tin của bạn. Sẽ liên hệ
            lại sớm nhất.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Họ Tên *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên của bạn"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Số Điện Thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0xxx.xxx.xxx"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.label}>
                Loại Yêu Cầu *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="general">Yêu cầu chung</option>
                <option value="volunteer">Muốn tình nguyện</option>
                <option value="donate">Muốn quyên góp</option>
                <option value="partner">Hợp tác doanh nghiệp</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Chủ Đề *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Vui lòng nhập chủ đề"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Lời Nhắn *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Nhập nội dung thông tin của bạn..."
              rows={6}
              className={styles.textarea}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitButton}>
            Gửi Thông Tin
          </button>
        </form>
      </div>
    </section>
  );
}
