
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import path from "node:path";

const localEnvPath = path.resolve(".env.local");

if (existsSync(localEnvPath)) {
	loadEnvFile(localEnvPath);
}
