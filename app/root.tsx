import "#app/tailwind.css";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Links, Meta, Outlet, Scripts } from "react-router";


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
