//@ts-check
const axios = require("axios").default;
const CosmosClient = require('@azure/cosmos').CosmosClient;

const { endpoint, key, databaseId, containerId } = require('./config');

const options = { endpoint, key };

const client = new CosmosClient(options);
const database = client.database(databaseId);
const container = database.container(containerId);
const items = container.items;
module.exports = async function (context, req) {
  if (req.method === 'POST') {
  
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {name: "@id", value: req.body.q}
      ]
    };

    const it = await items.query(querySpec);
    const page = await it.fetchNext();
    if (page.resources.length > 0) {
      const result = page.resources[0];
      await items.upsert({...result, accessed_at: [Date.now(), ...result.accessed_at]});

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: result.results
      };
      return;
    }

    let definitions = {};
    try {
      definitions = await axios.get(`${process.env.REACT_APP_OXFORD_ENDPOINT}/words/es`, {
        headers: {
          "Accept": "application/json",
          "app_id": process.env.REACT_APP_OXFORD_APP_ID || '',
          "app_key": process.env.REACT_APP_OXFORD_API_KEY || ''
        },
        params: {q: req.body.q}
      });
    } catch (error) {
      if (error.response.status === 404) {
        context.res = { body: [] }
      }
      else {
        console.error(error);
        context.res = error.response;
      }
      return;
    }

    let images = [];
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BING_ENDPOINT}/v7.0/images/search`, {
        headers: {"Ocp-Apim-Subscription-Key" : process.env.REACT_APP_BING_KEY_1 || ''}, 
        params: {q: req.body.q}
      });
      images = resp.data.value.slice(0, 4).map(i => i.contentUrl);
    } catch (error) {
      console.error(error);
      context.res = error.response;
      return;
    }

    if (!Array.isArray(definitions.data.results)) {
      context.res = {
        body: []
      }
      return;
    }

    const remap = [];
    for (var r of definitions.data.results) {
      if (!Array.isArray(r.lexicalEntries)) continue;

      for (var e of r.lexicalEntries) {
        if (!Array.isArray(e.entries)) continue;

        for (var n of e.entries) {
          if (!Array.isArray(n.senses)) continue;

          for (var s of n.senses) {
            const toAdd = {
              id: r.id,
              word: r.word,
              notes: e.notes,
              definitions: s.definitions,
              examples: s.examples,
              images: images
            };
            remap.push(toAdd);
          }
        }
      }

    await items.upsert({id: req.body.q, accessed_at: [Date.now()], results: remap, "user": "richy"});

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: remap
    };

    }
  }
}