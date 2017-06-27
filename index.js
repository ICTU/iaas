const openstack = require("./openstack");
const loadConfig = require("./loadConfig");

const servers = loadConfig(process.argv.pop());

const { createServer } = openstack.createClient({
  username: process.env.OS_USERNAME,
  password: process.env.OS_PASSWORD,
  authUrl: process.env.OS_AUTH_URL,
  region: process.env.OS_REGION
});

for (let server of servers) {
  createServer(server);
}
