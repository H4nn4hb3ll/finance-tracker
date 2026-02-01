import React, { useState } from "react";
import * as Facade from "./Facade.js";

export default function LandingPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handles user login
  async function handleLogin() {
    try {
      const data = await Facade.login(username, password);
      alert(data.message);
      if (data.status == 1) {
        onLogin(username); //Pass username to dashboard
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  }

  // Handles user account creation
  async function handleCreateAccount() {
    try {
      const data = await Facade.createUser(username, password);
      alert(data.message);
    } catch (error) {
      console.error("Account creation error:", error);
      alert("An error occurred during account creation.");
    }
  }

  return (
    <div className="bg-gradient">
      <div className="frosted-box">
        <h1 className="heading">Welcome to Finance App</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <div className="flex space-x-4 mt-6">
          <button onClick={handleLogin} className="btn-green">Login</button>
          <button onClick={handleCreateAccount} className="btn-purple">Create Account</button>
        </div>
      </div>
    </div>
  );
}