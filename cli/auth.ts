import { clearSession, getSession } from "./storage";

// utils/auth.ts
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3000/api/validate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function logout() {
  await clearSession();
  console.log("✅ Successfully logged out.");
}

export async function checkSession() {
  const token = await getSession();
  if (!token) {
    console.log("You are not logged in. Run `login` to authenticate.");
    return;
  }

  // Validate token with server
  const isValid = await validateToken(token);
  if (!isValid) {
    console.log("Session expired. Please log in again.");
    await clearSession();
    return;
  }

  console.log("You are logged in!");
}
