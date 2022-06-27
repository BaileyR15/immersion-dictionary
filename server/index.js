const express = require("express");
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(express.static("public"));

app.get("/definitions", async (req, res) => {
  let response = {};
  try {
    response = await axios.get(`${process.env.REACT_APP_OXFORD_ENDPOINT}/words/es`, {
      headers: {
        "Accept": "application/json",
        "app_id": "4fd6ba42",
        "app_key": "c6985bdad2e9014906b5769b275fd862"
      },
      params: req.query
    });
  } catch (error) {
    console.error(error);
    response.data = error;
  }

  res.json(response.data)
});

app.get("/images", async (req, res) => {
  let response = {};
  try {
    response = await axios.get(`${process.env.REACT_APP_BING_ENDPOINT}/v7.0/images/search`, {
      headers: {"Ocp-Apim-Subscription-Key" : process.env.REACT_APP_BING_KEY_1}, 
      params: req.query
    });
  } catch (error) {
    console.error(error);
    response.data = error;
  }

  res.json(response.data)
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});