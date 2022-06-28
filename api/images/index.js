const axios = require("axios");

module.exports = async function (context, req) {
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
    context.res.json(response.data);
}