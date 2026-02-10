"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { ScreenBreakpoints } from "@/lib/screen-breakpoints";
import { cn } from "@/lib/utils";
import {
  useVirtualizer,
  useWindowVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual";
import * as React from "react";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (
    item: T,
    index: number,
    virtualItem: VirtualItem,
  ) => React.ReactNode;
  estimateSize: (index: number) => number;
  parentRef: React.RefObject<HTMLElement | null>;
  overscan?: number;
  className?: string;
  containerClassName?: string;
  forceInternalScroll?: boolean;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  estimateSize,
  parentRef,
  overscan = 2,
  className,
  containerClassName,
  forceInternalScroll = false,
}: VirtualizedListProps<T>) {
  const isMobile = useMediaQuery(ScreenBreakpoints.MOBILE);
  const useInternalScroll = isMobile || forceInternalScroll;
  const count = items.length;

  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    if (!parentRef.current) return;

    let frameId: number;
    const observer = new ResizeObserver(() => {
      frameId = requestAnimationFrame(() => forceUpdate());
    });

    observer.observe(parentRef.current);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [parentRef]);

  const getScrollElement = React.useCallback(
    () => parentRef.current,
    [parentRef],
  );

  // Optimize: Memoize options to prevent unnecessary re-creation of the virtualizer
  // We separate mobile and desktop instances to keep hooks consistent
  const rowVirtualizer = useInternalScroll
    ? useVirtualizer({
        count,
        getScrollElement,
        estimateSize,
        overscan,
      })
    : useWindowVirtualizer({
        count,
        estimateSize,
        overscan,
        scrollMargin: parentRef.current?.offsetTop ?? 0,
      });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const desktopScrollMargin = !useInternalScroll
    ? ((rowVirtualizer as any).options.scrollMargin ?? 0)
    : 0;

  return (
    <div className={cn("flex flex-col flex-1 min-h-0", containerClassName)}>
      <div
        className={cn("relative w-full will-change-transform", className)}
        style={{
          height: `${totalSize}px`,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          const key = virtualItem.key;
          const translateY = virtualItem.start - desktopScrollMargin;

          return (
            <div
              key={key}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translate3d(0, ${translateY}px, 0)`,
                willChange: "transform",
              }}
            >
              {renderItem(item, virtualItem.index, virtualItem)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
