import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckIcon } from "./check";
import { ConnectIcon } from "./connect";
import { CursorClickIcon } from "./cursor-click";
import { InfoIcon } from "./info";
import { MonitorIcon } from "./monitor";
import { MoonIcon } from "./moon";
import { PlusIcon } from "./plus";
import { SearchIcon } from "./search";
import { SparklesIcon } from "./sparkles";
import { SunIcon } from "./sun";
import { DeleteIcon } from "./trash";
import { XIcon } from "./x";

describe("Icons", () => {
  const iconComponents = [
    { name: "CheckIcon", Comp: CheckIcon },
    { name: "MonitorIcon", Comp: MonitorIcon },
    { name: "MoonIcon", Comp: MoonIcon },
    { name: "PlusIcon", Comp: PlusIcon },
    { name: "SearchIcon", Comp: SearchIcon },
    { name: "SunIcon", Comp: SunIcon },
    { name: "ConnectIcon", Comp: ConnectIcon },
    { name: "CursorClickIcon", Comp: CursorClickIcon },
    { name: "InfoIcon", Comp: InfoIcon },
    { name: "SparklesIcon", Comp: SparklesIcon },
    { name: "DeleteIcon", Comp: DeleteIcon },
    { name: "XIcon", Comp: XIcon },
  ];

  iconComponents.forEach(({ name, Comp }) => {
    it(`${name} renders and handles hover`, () => {
      const { container } = render(<Comp />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();

      const div = container.firstChild;
      if (div) {
        fireEvent.mouseEnter(div);
        fireEvent.mouseLeave(div);
      }
    });
  });
});
