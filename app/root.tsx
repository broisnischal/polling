import { Links, Meta, Outlet, Scripts } from "react-router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import "#app/tailwind.css";

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>

        <Scripts />
      </body>
    </html>
  );
}
