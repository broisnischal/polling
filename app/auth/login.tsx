import { parseAsString, useQueryState } from "nuqs";
import { Form } from "react-router";

export async function loader() {
  return null;
}

export default function Login() {
  const [token] = useQueryState("token", parseAsString);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <br />

      <div>
        <p className="w-1/2">
          Polling | This is a simple app demonstrating a short, long, and
          immediate polling for the remote auth, using the cli, desktop, or
          whatever.
        </p>
      </div>
      <br />
      {token ? (
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
        </div>
      )}
      {/* <div>
        <h1>Authentication Successful!</h1>
        <p>You can now return to your CLI tool</p>
      </div> */}
    </div>
  );
}
