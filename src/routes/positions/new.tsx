import { NewPositionForm } from "@/components/new-position/new-position-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/positions/new")({
  component: NewPositionComponent,
});

function NewPositionComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center sm:pt-[7vh] pt-5 relative">
      <NewPositionForm />
    </main>
  );
}
