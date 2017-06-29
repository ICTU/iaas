const openstack = require("./openstack");
const loadConfig = require("./loadConfig");

const { servers, networks } = loadConfig(process.argv.pop());

const { createServer, createNetwork } = openstack.createClient({
  username: process.env.OS_USERNAME,
  password: process.env.OS_PASSWORD,
  authUrl: process.env.OS_AUTH_URL,
  region: process.env.OS_REGION
});

Promise.all(networks.map(createNetwork))
  .then(servers.map(createServer))
  .catch(console.error);
