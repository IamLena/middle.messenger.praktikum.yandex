import { defineConfig } from "vite";

export default defineConfig({
	root: "src",
	build: {
		outDir: "../dist",
		rollupOptions: {
			input: {
				main: "src/index.html",
			},
		},
	},
	server: { port: 3000 },
	preview: { port: 3000 },
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
});
