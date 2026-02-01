import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import PrototypePage from "../pages/PrototypePage";

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          transactions: [
            {
              merchant_name: "Mock Store",
              name: "Test Transaction",
              transaction_type: "debit",
              amount: 50.75,
              date: "2025-10-21",
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PrototypePage Component", () => {
  test("renders the base PrototypePage UI", () => {
    render(<PrototypePage />);
    expect(screen.getByText("Create Link Token")).toBeInTheDocument();
    expect(screen.getByText("display transactions")).toBeInTheDocument();
    expect(screen.getByText("No data yet")).toBeInTheDocument();
  });

  test("handles empty transactions", async () => {
    // Mock an empty transaction list
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ transactions: [] }),
    });

    render(<PrototypePage />);

    const button = screen.getByText("display transactions");
    fireEvent.click(button);

    // Expect "No data yet" still visible or grid empty
    await waitFor(() =>
      expect(screen.queryByText("Mock Store")).not.toBeInTheDocument()
    );
  });
});
