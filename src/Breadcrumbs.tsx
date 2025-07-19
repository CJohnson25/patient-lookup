import { Link, useMatches } from "react-router";
import { MatchWithHandle } from "./types";

/**
 * Breadcrumbs component displays navigation links based on the current route.
 * It uses the `useMatches` hook to get the current route matches and renders
 * breadcrumbs for each match that has a breadcrumb label defined in its handle.
 */
export default function Breadcrumbs() {
  const matches = useMatches() as MatchWithHandle[];

  // Filter out routes that don't have a breadcrumb label
  const crumbs = matches
    .filter((match) => match.handle && match.handle.breadcrumb)
    .map((match, idx, arr) => {
      const isLast = idx === arr.length - 1;
      const { breadcrumb } = match.handle!;
      return isLast ? (
        <span key={match.pathname}>{breadcrumb(match)}</span>
      ) : (
        <span key={match.pathname}>
          <Link to={match.pathname}>{breadcrumb(match)}</Link> &gt;{" "}
        </span>
      );
    });

  return <nav className="mb-4">{crumbs}</nav>;
}
