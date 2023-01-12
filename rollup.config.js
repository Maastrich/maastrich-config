import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default defineConfig({
  input: "src/config.ts",
  output: [
    {
      file: "dist/config.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/config.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    commonjs(),
    nodeResolve(),
  ],
});
