import * as haptic from "@/lib/haptic";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScaleClickAnimation } from "./scale-click-animation";

// Mock triggerHaptic
vi.spyOn(haptic, "triggerHaptic");

describe("ScaleClickAnimation", () => {
  it("renders children correctly", () => {
    render(
      <ScaleClickAnimation>
        <div>Content</div>
      </ScaleClickAnimation>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("triggers haptic feedback on pointer down", () => {
    render(
      <ScaleClickAnimation>
        <button>Click me</button>
      </ScaleClickAnimation>,
    );

    const element = screen.getByText("Click me");
    fireEvent.pointerDown(element);

    expect(haptic.triggerHaptic).toHaveBeenCalled();
  });

  it("renders as child when asChild is true", () => {
    // If asChild is true, it uses Slot, merging props onto the child.
    // We check if the child receives the listeners.
    render(
      <ScaleClickAnimation asChild>
        <button>Slotted Button</button>
      </ScaleClickAnimation>,
    );

    const button = screen.getByRole("button", { name: "Slotted Button" });
    fireEvent.pointerDown(button);
    expect(haptic.triggerHaptic).toHaveBeenCalled();
  });
});
