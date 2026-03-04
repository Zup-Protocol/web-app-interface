import { LocaleInitializer } from "@/components/common/locale-initializer";
import { Header } from "@/components/header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <LocaleInitializer />
      <Header />
      <Outlet />
    </React.Fragment>
  );
}
