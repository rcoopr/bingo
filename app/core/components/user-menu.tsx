import { Form } from "@remix-run/react";

export function UserMenu() {
  return (
    <Form action="/logout" method="post">
      <div className="dropdown-end dropdown">
        <label tabIndex={0} className="flex cursor-pointer items-center">
          <div
            className="rounded border border-base-content/50 px-2 py-1 pr-8 font-medium"
            style={{ fontVariantCaps: "small-caps" }}
          >
            Username
          </div>
          <div className="avatar online -ml-6">
            <div className="mask mask-hexagon-2 w-14 bg-base-content/10">
              <div className="mask mask-hexagon-2 m-1 w-12">
                <img alt="avatar" src="https://placeimg.com/128/128/people" />
              </div>
            </div>
          </div>
        </label>
        <ul
          // tabIndex={0}
          className="dropdown-content menu menu-compact mt-2 mr-0 w-52 rounded border border-base-200 bg-base-100 p-2 shadow"
        >
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <button
              type="submit"
              className="mt-2 bg-error/20 text-error-content hover:bg-error/50 hover:text-error-content focus:bg-error/50 active:bg-error/75 active:text-error-content"
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </Form>
  );
}
