// setupTests.js
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Optional: mock window.alert to avoid actual pop-ups
beforeAll(() => {
  global.alert = vi.fn();
});