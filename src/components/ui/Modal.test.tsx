import { fireEvent, render, screen } from "@testing-library/react";
import { forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "./modal";

// Mock matchMedia simply as true
vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => true,
}));

// Mock framer-motion simply
vi.mock("framer-motion", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: forwardRef(({ children, onClick, ...props }: any, ref) => (
        <div {...props} ref={ref as any} onClick={onClick}>
          {children}
        </div>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  it("renders nothing when closed", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>,
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders content when open and calls onOpen", async () => {
    const onOpen = vi.fn();
    render(
      <Modal isOpen={true} onClose={vi.fn()} onOpen={onOpen}>
        <div data-testid="modal-content">ModalContent</div>
      </Modal>,
    );

    const content = await screen.findByTestId("modal-content");
    expect(content).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalled();
  });

  it("calls onClose and onOpenChange when clicking backdrop", async () => {
    const onClose = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} onOpenChange={onOpenChange}>
        <div data-testid="modal-inner">Inner</div>
      </Modal>,
    );

    await screen.findByTestId("modal-inner");
    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not call onClose when closeOnOverlayClick is false", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
        <div data-testid="modal-inner">Inner</div>
      </Modal>,
    );

    await screen.findByTestId("modal-inner");
    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("handles escape key", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div data-testid="modal-inner">Inner</div>
      </Modal>,
    );

    await screen.findByTestId("modal-inner");

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not handle escape key when closeOnEscape is false", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
        <div data-testid="modal-inner">Inner</div>
      </Modal>,
    );

    await screen.findByTestId("modal-inner");

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
