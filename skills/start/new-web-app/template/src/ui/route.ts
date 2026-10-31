import { useEffect, useState } from "react";
import { routes, type PageId } from "../pages";

// Routes live in the URL hash (#/starred), so the build runs from any folder
// with no server rewrites, and the query string (?store=test) survives
// navigation.
function readRoute(): PageId {
  const id = location.hash.replace(/^#\/?/, "");
  return (routes as string[]).includes(id) ? (id as PageId) : "all";
}

export function useRoute(): PageId {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
