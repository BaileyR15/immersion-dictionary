const axios = require("axios");

module.exports = async function (context, req) {
    let response = {};
    try {
      response = await axios.get(`${process.env.REACT_APP_OXFORD_ENDPOINT}/words/es`, {
        headers: {
          "Accept": "application/json",
          "app_id": process.env.REACT_APP_OXFORD_APP_ID,
          "app_key": process.env.REACT_APP_OXFORD_API_KEY
        },
        params: req.query
      });
    } catch (error) {
      console.error(error);
      response.data = error;
    }
  
    context.res = response.data;
}