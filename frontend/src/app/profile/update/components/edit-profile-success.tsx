interface EditProfileSuccessProps {
  show: boolean;
}

export default function EditProfileSuccess({ show }: EditProfileSuccessProps) {
  if (!show) return null;

  return (
    <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg animate-in fade-in">
      <p className="text-primary font-medium flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        Thông tin đã được cập nhật thành công
      </p>
    </div>
  );
}
