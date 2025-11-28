// src/Facade.js
const serverAddress = "http://localhost:3333";

// Log in user
export async function login(username, password) {
    const response = await fetch(`${serverAddress}/api/users/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

// Create new user
export async function createUser(username, password) {
    const response = await fetch(`${serverAddress}/api/users/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

export async function getBudget(username, accessToken, accountName) {
    const response = await fetch(`${serverAddress}/api/users/getBudget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, accessToken, accountName })
    });
    return response.json();
}

export async function setBudget(username, accountName, budget) {
    const response = await fetch(`${serverAddress}/api/users/getBudget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, accountName, budget })
    });
    return response.json();
}

// Request a new link token
export async function createLinkToken(clientName) {
    const response = await fetch(`${serverAddress}/api/plaid/createLinkToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_name: clientName })
    });
    return response.json();
}

// Exchange public token for access token
export async function getAccessToken(publicToken) {
    const response = await fetch(`${serverAddress}/api/plaid/getAccessToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicToken }),
    });
    const data = await response.json();
    return { accessToken: data.accessToken };
}
  
// Fetch transactions
export async function getTransactions(accessToken) {
    const response = await fetch(`${serverAddress}/api/plaid/getTransactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken })
    });
    return response.json();
}

export async function getExistingToken(username){
    const response = await fetch(`${serverAddress}/api/users/getExistingToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username })
    });
    return response.json();
}

export async function addToken(userName, token){
    const response = await fetch(`${serverAddress}/api/users/addToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, accessToken: token})
    });
    return response.json();
}
