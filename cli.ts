import { exec } from "child_process";
import ora from "ora";
import { v4 as uuid } from "uuid";
import { db } from "./db/index";
import { session } from "./db/schema/index";

// const API_BASE = "https://localhost.snehaa.store";
const API_BASE = "http://localhost:5173";

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
  const openCommand = process.platform === 'win32' ? 'start' :
    process.platform === 'darwin' ? 'open' : 'xdg-open';

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

  const checkAuth = async () => {
    spinner.text = "Checking authentication status...";

    const session = await db.query.session.findFirst({
      where: (session, { eq }) => eq(session.id, sessionId),
    });

    if (session?.status === "authorized") {
      spinner.succeed("Successfully authenticated!");
      process.exit(0);
    }

    if (session?.status === "expired") {
      spinner.fail("Session expired");
      process.exit(1);
    }

    spinner.text = "Waiting for authentication...";
  };

  // Check every 2 seconds
  const interval = setInterval(checkAuth, 2000);

  setTimeout(() => {
    clearInterval(interval);
    spinner.fail("Authentication timeout");
    process.exit(1);
  }, 3 * 60 * 1000);
}
