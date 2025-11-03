export default function EditProfileHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
        <svg
          className="w-8 h-8 text-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <h1
        className="text-4xl font-bold mb-2"
        style={{ color: "oklch(0.50 0.12 155)" }}
      >
        Hồ Sơ Của Bạn
      </h1>
      <p className="text-muted-foreground text-lg">
        Cập nhật thông tin liên lạc của bạn
      </p>
    </div>
  );
}
