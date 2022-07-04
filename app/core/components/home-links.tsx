import { Link } from "@remix-run/react";

export const HomeLinks = ({ isAuth }: { isAuth: boolean }) =>
  isAuth ? <HomeNavLinks /> : <LoginLinks />;

const LoginLinks = () => (
  <div className="flex flex-col items-center space-y-4">
    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
      <Link
        to="/join"
        className="flex items-center justify-center rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-cyan-700 shadow-sm hover:bg-cyan-50"
      >
        Sign up
      </Link>
      <Link
        to="/login"
        className="flex items-center justify-center rounded-md bg-cyan-500 px-4 py-3 font-medium text-white hover:bg-cyan-600 "
      >
        Log In
      </Link>
    </div>
    <p>Sign in to create and manage games</p>
  </div>
);

const HomeNavLinks = () => (
  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
    <Link
      to="/games"
      prefetch="intent"
      className="flex items-center justify-center rounded-md border-2 border-cyan-500 px-4 py-3 font-medium text-white hover:text-cyan-500"
    >
      Create
    </Link>
    <Link
      to="/create"
      prefetch="intent"
      className="flex flex-col items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-slate-800 shadow-sm  hover:bg-yellow-600"
    >
      Browse
    </Link>
  </div>
);
