import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // Thêm object này để tắt tất cả các lỗi
  {
    rules: {
      // Đã tắt từ trước
      "@typescript-eslint/no-explicit-any": "off",

      // === CÁC QUY TẮC MỚI BẠN MUỐN TẮT ===

      // Tắt lỗi "biến không dùng"
      "@typescript-eslint/no-unused-vars": "off",

      // Tắt lỗi "gọi Hook sai vị trí"
      "react-hooks/rules-of-hooks": "off",

      // Tắt lỗi "comment sai cú pháp trong JSX"
      "react/jsx-no-comment-textnodes": "off",

      // Tắt lỗi "interface rỗng"
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;
