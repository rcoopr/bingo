import { Link } from "@remix-run/react";

export function NewGameFormTabs() {
  return (
    <div className="tabs flex h-16 w-full flex-col items-center justify-evenly md:flex-row">
      <Link to="" className="tab tab-bordered h-full flex-grow gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-700">
          <p
            tabIndex={0}
            className="text-base font-medium leading-none text-white focus:outline-none"
          >
            1
          </p>
        </div>
        <span>Details</span>
      </Link>
      <Link
        to=""
        className="tab tab-active tab-bordered h-full flex-grow gap-6"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-700">
          <p
            tabIndex={0}
            className="text-base font-medium leading-none text-white focus:outline-none"
          >
            2
          </p>
        </div>
        <span>Tiles</span>
      </Link>
      <Link to="" className="tab tab-bordered h-full flex-grow gap-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-700">
          <p
            tabIndex={0}
            className="text-base font-medium leading-none text-white focus:outline-none"
          >
            3
          </p>
        </div>
        <span>Teams</span>
      </Link>
    </div>
  );
}
