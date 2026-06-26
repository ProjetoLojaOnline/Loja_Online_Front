import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom does not implement ResizeObserver (required by Radix UI internals)
globalThis.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};
