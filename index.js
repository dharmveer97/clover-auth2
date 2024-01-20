const express = require("express");
const axios = require("axios");

// Config Set Up
const targetEnv = "https://sandbox.dev.clover.com"; // Pointing to Sandbox Environment
// const targetEnv = 'https://www.clover.com'; // Pointing to Prod Environment

const appID = process.env.APP_ID; // Input your app ID here
const appSecret = process.env.APP_SECRET_KEY; // Input your app secret here

// Initialize Express
const app = express();

// Root Route
app.get("/", authenticate);

// Steps 1 & 2 - Request merchant authorization to receive an authorization code
async function authenticate(req, res) {
  const url = `${targetEnv}/oauth/authorize?client_id=${appID}`;
  try {
    if (!req.query.code) {
      // If there is no code parameter in the query string, redirect user for authentication
      return res.redirect(url);
    }

    // If there is a code parameter, proceed to request API token
    const data = await requestAPIToken(req.query.code);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Steps 3 & 4 - Request and serve up API token using the received authorization code
async function requestAPIToken(code) {
  const url = `${targetEnv}/oauth/token`;
  const params = {
    client_id: appID,
    client_secret: appSecret,
    code: code,
  };

  const response = await axios.get(url, { params });

  return response.data;
}

// Dynamic Port Binding
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🍀 Run http://localhost:${port} in your browser`));
