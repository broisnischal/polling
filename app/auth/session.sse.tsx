import { eventStream } from "remix-utils";
import type { Route } from "./+types/session.sse";
// import { timeout } from "remix-utils/promise";
// import { CSRF } from "remix-utils/csrf/server";

export async function loader({ request }: Route.LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    let timer = setInterval(() => {
      send({ event: "time", data: new Date().toISOString() });
    }, 1000);

    return function clear() {
      clearInterval(timer);
    };
  });
}
