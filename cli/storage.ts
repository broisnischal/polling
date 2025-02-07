// utils/storage.ts
import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
} from "fs";
import { homedir } from "os";
import { join } from "path";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const STORAGE_PATH = join(homedir(), ".my-cli-app", "session");
const ENCRYPTION_KEY = process.env.CLI_ENCRYPTION_KEY || "default-key";
const ALGORITHM = "aes-256-cbc";

function ensureStorageDir() {
  const dir = join(homedir(), ".my-cli-app");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function saveSession(token: string) {
  ensureStorageDir();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  writeFileSync(
    STORAGE_PATH,
    JSON.stringify({ iv: iv.toString("hex"), data: encrypted })
  );
}

export function getSession(): string | null {
  if (!existsSync(STORAGE_PATH)) return null;
  const { iv, data } = JSON.parse(readFileSync(STORAGE_PATH, "utf-8"));
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function clearSession() {
  if (existsSync(STORAGE_PATH)) {
    unlinkSync(STORAGE_PATH);
  }
}
