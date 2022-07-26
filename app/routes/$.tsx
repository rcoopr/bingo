import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = ({ params }) => ({ path: params["*"] });

const PageNotFound = () => (
  <div className="grid min-h-screen place-items-center">
    <div className="flex flex-col">
      <h1 className="text-3xl font-extrabold">404</h1>
      <h2 className="text-3xl font-extralight">
        Sorry, this page doesn't exist!
      </h2>
      <div className="divider" />
      <Link
        to={"/"}
        className="rounded bg-info/10 p-4 text-info transition-colors hover:bg-info/20"
      >
        Back to <span className="font-semibold">Home</span>
      </Link>
    </div>
  </div>
);

export default PageNotFound;
