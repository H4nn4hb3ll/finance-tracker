import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import Dashboard from "../pages/Dashboard.jsx";
import * as Facade from "../Facade.js";

vi.mock("../Facade.js", () => ({
  createLinkToken: vi.fn(),
  getAccessToken: vi.fn()
}));

describe("Dashboard functions (Facade-based)", () => {
  beforeEach(() => {
    global.Plaid = { create: vi.fn(() => ({ open: vi.fn() })) };
    global.alert = vi.fn();
    console.error = vi.fn();
  });

  it("calls Facade.createLinkToken on button click", async () => {
    Facade.createLinkToken.mockResolvedValue({ link_token: "dummyToken" });

    render(<Dashboard username="testuser" />);
    fireEvent.click(screen.getByText("Link Bank Account"));

    await new Promise(process.nextTick);

    expect(Facade.createLinkToken).toHaveBeenCalledWith("testuser");
    expect(global.Plaid.create).toHaveBeenCalled();
  });
});
