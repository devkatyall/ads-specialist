// eslint.config.js  (or whatever filename you’re loading)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// 1️⃣  Pull in Next.js’ core-web-vitals preset
// 2️⃣  Append a plain object that adds/overrides rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),

  // Any rule settings declared later in the array override
  // earlier ones, exactly like “extends” in the classic RC file
  {
    rules: {
      // Change `"error"`  ➜  `"warn"` if you still want the
      // feedback but not a build-blocking error.
      "react/no-unescaped-entities": "off",
      // or:  "react/no-unescaped-entities": "warn"
    },
  },
];

export default eslintConfig;
