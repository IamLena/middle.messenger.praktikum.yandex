import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
	globalIgnores(["**/node_modules/**", "**/dist/**"]),
	eslint.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"no-console": "warn",
		},
	},
	{
		files: ["**/test.ts"],
		rules: {
			"no-console": "off",
		},
	}
);
