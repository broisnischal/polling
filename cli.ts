import { $ } from "bun";
import { v4 as uuid } from "uuid";

const API_BASE = "http://localhost:5173";

async function loginWithBrowser() {
  const token = uuid();

  await $`open ${API_BASE}/auth/login?token=${token}`;

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
