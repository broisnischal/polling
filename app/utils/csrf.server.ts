import { createCookie } from "react-router";
import { CSRF } from "remix-utils/csrf/server";

export const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: [process.env.SESSION_SECRET!],
});

export const csrf = new CSRF({
  cookie,
  formDataKey: "_csrf",
  secret: process.env.CSRF_SECRET!,
});
