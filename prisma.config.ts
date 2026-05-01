
import { loadEnvFile } from "node:process";
import path from "node:path";

loadEnvFile(path.resolve(".env.local"));
