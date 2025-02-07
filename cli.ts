import { exec } from "child_process";
import ora from "ora";
import { v4 as uuid } from "uuid";
import { db } from "./db/index";
import { session } from "./db/schema/index";
import { eq } from "drizzle-orm";
import { checkSession, logout } from "./cli/auth";

import { Command } from "commander";
import login from "#app/auth/login.js";

const API_BASE = "http://localhost:5173";

const program = new Command();

program
  .command("login")
  .description("Log in to your account")
  .action(loginWithBrowser);

program.command("logout").description("Log out of your account").action(logout);

program
  .command("status")
  .description("Check login status")
  .action(checkSession);

program.parse(process.argv);

/// other logic

// const API_BASE = "https://localhost.snehaa.store";

async function loginWithBrowser() {
  const token = uuid();

  const randomUserId = Math.floor(Math.random() * 1000);

  console.log(randomUserId);

  /// hash the token if needed

  const [res] = await db
    .insert(session)
    .values({
      token,
      userId: randomUserId,
    })
    .returning();

  if (!res) {
    throw new Error("Unable to create session.");
  }

  // Use platform-specific command to open browser
  const openCommand =
    process.platform === "win32"
      ? "start"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open";

  exec(`${openCommand} ${API_BASE}/auth/login?token=${res.token}`);

  //   await fetch(`${API_BASE}/auth/login`, {
  //     method: "POST",
  //     body: JSON.stringify({ token }),
  //   });

  pollForAuthStatus({ sessionId: res.id });
}

// Run CLI
console.log("Starting authentication...");
await loginWithBrowser();

function pollForAuthStatus({ sessionId }: { sessionId: number }) {
  const spinner = ora("Waiting for authentication...").start();
  let interval: NodeJS.Timeout;

  const cleanup = async () => {
    await db
      .update(session)
      .set({ status: "revoked" })
      .where(eq(session.id, sessionId));

    clearInterval(interval);
    spinner.stop();
  };

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });
  // Handle process exit events
  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  const checkAuth = async () => {
    spinner.text = "Checking authentication status...";

    const session = await db.query.session.findFirst({
      where: (session, { eq }) => eq(session.id, sessionId),
    });

    if (session?.status === "authorized") {
      spinner.succeed("Successfully authenticated!");
      // Store the session! on whatever, like cli, figma, vscode, or desktop etcs
      process.exit(0);
    }

    if (session?.status === "expired") {
      spinner.fail("Session expired");
      process.exit(1);
    }

    spinner.text = "Waiting for authentication...";
  };

  // Check every 2 seconds
  interval = setInterval(checkAuth, 2000);

  setTimeout(() => {
    cleanup();
    spinner.fail("Authentication timeout");
    process.exit(1);
  }, 3 * 60 * 1000);
}
