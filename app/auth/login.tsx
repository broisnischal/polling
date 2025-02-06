import { eq } from "drizzle-orm";
import { parseAsString } from "nuqs";
import { createLoader } from "nuqs/server";
import { Form } from "react-router";
import { db } from "../../db/index";
import { session } from "../../db/schema/index";
import type { Route } from "./+types/login";

export const tokenSearchParams = {
  token: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(tokenSearchParams);

export async function loader({ request }: Route.LoaderArgs) {
  const { token } = loadSearchParams(request);

  const res = await db.query.session.findFirst({
    where: (session, { eq }) => eq(session.token, token),
  });

  // update the session for authorized

  if (!res) {
    return {
      token,
      success: false,
    };
  }

  await db
    .update(session)
    .set({ status: "authorized" })
    .where(eq(session.id, res.id));

  if (res?.status === "authorized") {
    return {
      token,
      success: true,
    };
  }

  return {
    token,
    success: false,
  };
}

export async function action({ request }: Route.ActionArgs) { }

export default function login({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <br />

      {loaderData.success && (
        <div>
          <p className="w-1/2">
            Polling | This is a simple app demonstrating a short, long, and
            immediate polling for the remote auth, using the cli, desktop, or
            whatever.
          </p>
        </div>
      )}
      <br />
      {loaderData.token ? (
        <Form className="flex flex-col gap-2 w-1/2 ">
          {/* <input type="hidden" name="token"  /> */}
          <input
            type="email"
            className="border p-2 border-gray-800/10 focus:border-gray-800 outline-none"
            placeholder="Enter your test email"
          />
          <input
            type="token"
            className="border p-2 border-gray-800/10 focus:border-gray-800 outline-none"
            placeholder="Enter your test token"
          />
          <button className="bg-gray-800 text-white p-2 w-min px-10">
            Login
          </button>
        </Form>
      ) : (
        <div>
          <p className="text-red-500 font-bold">
            Please try to login using the cli.
          </p>
          <p>
            Users logs in, then have the session and if the session active, ask
            user for the totp, then login.
          </p>
        </div>
      )}
      {/* <div>
        <h1>Authentication Successful!</h1>
        <p>You can now return to your CLI tool</p>
      </div> */}
    </div>
  );
}
