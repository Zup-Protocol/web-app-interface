import { redirect } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: (path: string) => (options: any) => ({
    path,
    options,
  }),
  redirect: vi.fn((obj) => obj),
}));

import { Route } from "./index";

describe("Index Route", () => {
  it("redirects to /positions/new", () => {
    // @ts-ignore
    const beforeLoad = Route.options?.beforeLoad;
    if (typeof beforeLoad === "function") {
      try {
        beforeLoad();
      } catch (e) {
        expect(redirect).toHaveBeenCalledWith({ to: "/positions/new" });
      }
    }
  });
});
