import { $ } from "bun";
import { v4 as uuid } from "uuid";
import { db } from "./db";
import { session } from "./db/schema/session";
import assert from "node:assert";

const API_BASE = "http://localhost:5173";

async function loginWithBrowser() {
  const token = uuid();

  const randomUserId = Math.floor(Math.random() * 1000);

  /// hash the token if needed

  const [res] = await db
    .insert(session)
    .values({
      token,
      userId: randomUserId,
    })
    .returning();

  if (!res) {
    assert.throws(() => {
      throw new Error("Unable to create session.");
    }, Error);
    return;
  }

  await $`open ${API_BASE}/auth/login?token=${res.token}`;

  //   await $.fetch(`${API_BASE}/auth/login`, {
  //     method: "POST",
  //     body: JSON.stringify({ token }),
  //   });

  return true;
}

// Run CLI
console.log("Starting authentication...");
const success = await loginWithBrowser();
if (success) {
  console.log("Successfully authenticated!");
  // Store credentials or proceed with CLI operations
} else {
  console.error("Authentication failed");
}
