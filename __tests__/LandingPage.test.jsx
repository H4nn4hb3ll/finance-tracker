import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import LandingPage from "../pages/LandingPage.jsx";
import * as Facade from "../Facade.js";

// Mock all Facade functions used by LandingPage
vi.mock("../Facade.js", () => ({
  login: vi.fn(),
  createUser: vi.fn()
}));

describe("LandingPage functions (Facade-based)", () => {
  let onLoginMock;

  beforeEach(() => {
    onLoginMock = vi.fn();
    global.alert = vi.fn(); 
    console.error = vi.fn();
    render(<LandingPage onLogin={onLoginMock} />);
  });

  it("calls Facade.createUser for account creation", async () => {
    Facade.createUser.mockResolvedValue({ status: 1, message: "User created successfully" });

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Create Account"));

    await new Promise(process.nextTick);

    expect(Facade.createUser).toHaveBeenCalledWith("testuser", "password");
    expect(global.alert).toHaveBeenCalledWith("User created successfully");
  });

  it("calls Facade.login when Login button is clicked", async () => {
    Facade.login.mockResolvedValue({ status: 1, message: "Login successful" });

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByText("Login"));

    await new Promise(process.nextTick);

    expect(Facade.login).toHaveBeenCalledWith("testuser", "password");
    expect(global.alert).toHaveBeenCalledWith("Login successful");
    expect(onLoginMock).toHaveBeenCalledWith("testuser");
  });
});
