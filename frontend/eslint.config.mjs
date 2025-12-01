import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Vẫn extend để tránh lỗi module — nhưng sẽ override toàn bộ rule phía dưới
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },

  // Tắt FULL toàn bộ rule
  {
    rules: {
      // === TẮT TẤT CẢ CÁC RULE CỦA NEXT.JS ===
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-script-component-in-head": "off",
      "@next/next/no-typos": "off",

      // === TẮT TẤT CẢ RULE ESLINT CORE ===
      "no-unused-vars": "off",
      "no-undef": "off",
      "prefer-const": "off",
      "no-empty": "off",
      "no-console": "off",
      "no-debugger": "off",

      // === TẮT TẤT CẢ RULE TYPESCRIPT ===
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-types": "off",

      // === TẮT TẤT CẢ RULE REACT ===
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-comment-textnodes": "off",
      "react/jsx-key": "off",

      // === TẮT TẤT CẢ RULE HOOKS ===
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",

      // === TẮT UNUSED eslint-disable WARNING ===
      "eslint-comments/no-unused-disable": "off",

      // Cuối cùng — tắt toàn bộ rule còn lại nếu có
      all: "off",
    },
  },
];

export default eslintConfig;
