import { eventStream } from "remix-utils/sse/server";
// import { interval } from "remix-utils/timers";
import type { Route } from "./+types/session.sse";
import { useEventSource } from "remix-utils/sse/react";

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

export default function Counter() {
  // Here `/sse/time` is the resource route returning an eventStream response
  let time = useEventSource("/session/sse", { event: "time" });

  if (!time) return null;

  return (
    <time dateTime={time}>
      {new Date(time).toLocaleTimeString("en", {
        minute: "2-digit",
        second: "2-digit",
        hour: "2-digit",
      })}
    </time>
  );
}
