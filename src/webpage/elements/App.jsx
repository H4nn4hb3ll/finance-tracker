import React, { useState } from "react";
import LandingPage from "./LandingPage.jsx";
import Dashboard from "./Dashboard.jsx";
import Prototype from "./PrototypePage.jsx";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <>
      {loggedInUser ? (
        //<Dashboard username={loggedInUser} />
        <>
          <h1>Redirect successful</h1>
          <Dashboard username={loggedInUser}/>
        </>
      ) : (
        <LandingPage onLogin={(username) => setLoggedInUser(username)} />
      )}
    </>
  );
}