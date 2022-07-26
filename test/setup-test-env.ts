import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";
import { server } from "mocks";
import { SUPABASE_URL } from "mocks/handlers";

process.env.SESSION_SECRET = "secret";
process.env.SUPABASE_SERVICE_ROLE = "{SERVICE_ROLE}";
process.env.SUPABASE_ANON_PUBLIC = "{ANON_PUBLIC}";
process.env.SUPABASE_URL = SUPABASE_URL;
process.env.SERVER_URL = "http://localhost:3000";

installGlobals();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
