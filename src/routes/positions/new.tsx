import { NewPositionForm } from "@/components/new-position/new-position-form";
import { cn } from "@/lib/utils";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/positions/new")({
  component: NewPositionComponent,
});

export function NewPositionComponent() {
  const { pathname } = useLocation();
  const isPoolsPage = pathname.endsWith("/pools");

  return (
    <main className="flex min-h-screen flex-col items-center sm:pt-[7vh] pt-5 relative">
      <div className={cn("w-full transition-opacity duration-300", isPoolsPage ? "opacity-0 pointer-events-none" : "opacity-100")}>
        <NewPositionForm />
      </div>
      <Outlet />
    </main>
  );
}
