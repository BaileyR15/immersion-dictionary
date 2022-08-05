// @ts-check

const config = {
    endpoint: "https://immersion-dictionary-db.documents.azure.com:443/",
    key: "Q7t1T2BDpH27NibGZm1iZdkR0hkmFSL7x4t3lmHURIaRLmMzejccFsmQBpclP9SACbgwrezrCt9pqJt4CwYCbA==",
    databaseId: "Queries",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/id"] }
  };
  
module.exports = config;