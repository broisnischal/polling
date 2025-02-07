import { db } from "#db/index.js";
import { eq } from "drizzle-orm";
import { parseAsString } from "nuqs";
import { createLoader } from "nuqs/server";
import { Form } from "react-router";
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

  if (res?.status === "authorized") {
    return {
      token,
      authorized: true,
      success: true,
    };
  }

  return {
    token,
    success: false,
  };
}

export async function action({ request }: Route.ActionArgs) {
  console.log("action");

  const formData = await request.formData();
  const token = formData.get("token");

  console.log(token);

  const res = await db.query.session.findFirst({
    where: (session, { eq }) => eq(session.token, token as string),
  });

  if (!res) {
    return {
      token,
      authorized: false,
    };
  }
  await db
    .update(session)
    .set({ status: "authorized" })
    .where(eq(session.id, res.id));

  return {
    token,
    authorized: true,
  };
}

export default function login({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="p-4">
      <br />
      <br />
      <h1 className="text-2xl font-bold">🔑 Device Login</h1>
      <br />
      <div>
        <p className="w-2/3">
          Polling | This is a simple app demonstrating a short, long, and
          immediate polling for the remote auth, using the cli, desktop, or
          whatever. ( cli, figma plugins, vscode exts, desktop apps, etcs).
        </p>
      </div>
      <br />
      {/* {loaderData.success ? (
        <></>
      ) : (
        <div>
          <h1>Your token is Invalid!</h1>
        </div>
      )} */}
      {loaderData.token || loaderData.success || !loaderData.authorized ? (
        <Form method="POST" className="flex flex-col gap-2 w-1/2 ">
          <input
            type="text"
            name="token"
            hidden
            defaultValue={loaderData.token}
            className="border p-2 border-gray-800/10 focus:border-gray-800 outline-none"
            placeholder="Enter your test token"
          />
          <button
            type="submit"
            className="bg-gray-800 cursor-pointer text-white p-2 w-min px-10"
          >
            Login
          </button>
        </Form>
      ) : (
        <div>
          {/* <p className="text-cyan-500 font-bold">
            Please try to login using the cli.
          </p> */}
        </div>
      )}
      {actionData && actionData.authorized && (
        <div>
          <p>You are now logged in. and can close the tab.</p>
        </div>
      )}
      <footer className="mt-[30vh] text-center text-gray-500 text-sm border-t p-10 border-black/10">
        <p>
          Users logs in, then have the session and if the session active, ask
          user for the totp, then login.
        </p>
      </footer>
    </div>
  );
}
