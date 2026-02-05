import { fireEvent, render, screen } from "@testing-library/react";
import { forwardRef, useImperativeHandle } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from "./dropdown";

// Mock framer-motion to avoid visibility issues in JSDOM
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

const MockIcon = forwardRef((props: any, ref) => {
  const startAnimation = vi.fn();
  const stopAnimation = vi.fn();
  useImperativeHandle(ref, () => ({
    startAnimation,
    stopAnimation,
  }));
  return <span data-testid="mock-icon" {...props} />;
});

MockIcon.displayName = "MockIcon";

const items = [
  { value: "opt1", label: "Option 1", icon: <MockIcon /> },
  { value: "opt2", label: "Option 2", icon: "TextIcon" },
];

describe("Dropdown", () => {
  it("renders trigger with selected label and icon", () => {
    render(<Dropdown items={items} selected="opt1" onSelect={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Option 1");
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("handles mouse enter and leave on trigger for animation", () => {
    render(<Dropdown items={items} selected="opt1" onSelect={vi.fn()} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
  });

  it("opens and shows options on click", async () => {
    render(<Dropdown items={items} selected="opt1" onSelect={vi.fn()} />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const option2 = await screen.findByText("Option 2");
    expect(option2).toBeVisible();
  });

  it("calls onSelect when item is clicked", async () => {
    const onSelect = vi.fn();
    render(<Dropdown items={items} selected="opt1" onSelect={onSelect} />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const option2 = await screen.findByRole("button", { name: /Option 2/i });
    fireEvent.click(option2);

    expect(onSelect).toHaveBeenCalledWith("opt2");
  });

  it("handles hover on dropdown items and triggers icon animation", async () => {
    render(<Dropdown items={items} selected="opt1" onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole("combobox"));

    const option1 = await screen.findByRole("button", { name: /Option 1/i });
    fireEvent.mouseEnter(option1);
    fireEvent.mouseLeave(option1);
  });

  it("renders text icon correctly", () => {
    render(<Dropdown items={items} selected="opt2" onSelect={vi.fn()} />);
    expect(screen.getByText("TextIcon")).toBeInTheDocument();
  });

  it("renders placeholder if no item is selected", () => {
    render(
      <Dropdown
        items={items}
        selected={"none" as any}
        onSelect={vi.fn()}
        placeholder="Choose..."
      />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose...");
  });
});
