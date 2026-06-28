
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import path from "node:path";
import { defineConfig } from "prisma/config";

const localEnvPath = path.resolve(".env.local");

if (existsSync(localEnvPath)) {
	loadEnvFile(localEnvPath);
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "ts-node prisma/seed.ts",
	},
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
