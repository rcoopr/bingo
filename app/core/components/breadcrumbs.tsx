import { Fragment } from "react";

import { Link, useLocation, useMatches } from "@remix-run/react";
import clsx from "clsx";

export function Breadcrumbs() {
  const location = useLocation();
  const pagename = location.pathname.match(/\w+$/gi)?.[0];

  const matches = useMatches();

  const crumbs = matches.filter(
    (match) => match.handle && match.handle.breadcrumb
  );

  return (
    <div className="border-t-1 relative -mt-px -ml-px -mb-4 overflow-hidden border-slate-300 pb-4 pr-4 drop-shadow-[1px_1px_0_rgb(31_54_92_/_0.41)]">
      <div
        className={clsx(
          // container
          "relative rounded-br-lg bg-slate-300 px-4 pb-2 text-slate-800",
          // before - bottom left flare
          "before:absolute before:top-full before:-left-px before:h-12 before:w-4",
          "before:rounded-tl-xl before:bg-transparent before:shadow-[0_-25px_0_0] before:shadow-slate-300",
          // after - top right flare
          "after:absolute after:left-full after:-top-px after:h-4 after:w-12",
          "after:rounded-tl-xl after:bg-transparent after:shadow-[-25px_0_0_0] after:shadow-slate-300"
        )}
      >
        <div className="">
          <div className="px-0.5 text-2xl font-bold capitalize">{pagename}</div>
          <ol className="flex gap-1 text-sm">
            {crumbs.map((match, index) => (
              <Fragment key={index}>
                <li key={index}>{match.handle!.breadcrumb()}</li>
                {index < crumbs.length - 1 && (
                  <div aria-hidden="true" className="h-1 w-1 select-none">
                    /
                  </div>
                )}
              </Fragment>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function BreadcrumbLink({ to, title }: { to: string; title: string }) {
  return (
    <Link className="px-1 hover:text-sky-800" to={to}>
      {title}
    </Link>
  );
}
