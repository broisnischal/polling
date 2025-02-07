# Example Polling

People keep telling me ~~remix~~ react router is overkill for small projects, but this file tree says otherwise.

```yml
├── README.md
├── app
│   ├── root.tsx
│   ├── routes.ts
│   └── tailwind.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

- React Router (vite plugin)
- React 19
- Typescript
- Tailwind 4 (vite plugin)

Flow

CLI Tool (Bun) Remix Server

| 1. Generate session ID ------------->|
| 2. Return session ID ---------------|
| 3. Open browser to /login?sessionId -|
| 4. Poll /api/session/:id ----------->|
| 5. Return auth status --------------|
| (repeat polling) --------------->|
| 6. Return "authenticated: true" ----|

1. Creates session and save into the auth/server or db
2. Opens the url in browser for user in order to login
3. User logs in, or doesn't
4. Polls /api/session/:id or the database and get the session status
5. if authorized, logs in else polls
6. timeout if not anything
