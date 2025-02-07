import { route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("auth/login", "auth/login.tsx"),
  route("session/sse", "auth/session.sse.tsx"),
] satisfies RouteConfig;
