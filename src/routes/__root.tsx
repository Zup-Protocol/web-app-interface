import { LocaleInitializer } from "@/components/common/locale-initializer";
import { Header } from "@/components/header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

export function RootComponent() {
  return (
    <React.Fragment>
      <LocaleInitializer />
      <Header />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </React.Fragment>
  );
}
