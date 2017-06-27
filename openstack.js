const { promisify } = require("util");
const pkgcloud = require("pkgcloud");
const { find } = require("lodash");

function handleServerResponse(err, server) {
  if (err) {
    console.dir(err);
    return;
  }

  console.log("SERVER CREATED: " + server.name + ", waiting for active status");

  server.setWait({ status: server.STATUS.running }, 5000, function(err) {
    if (err) {
      console.dir(err);
      return;
    }

    console.log("SERVER INFO");
    console.log(server.name);
    console.log(server.status);
    console.log(server.id);
  });
}

function createClient(opts) {
  const client = pkgcloud.providers.openstack.compute.createClient(opts);

  const getServers = promisify(client.getServers.bind(client));
  const getFlavors = promisify(client.getFlavors.bind(client));
  const getImages = promisify(client.getImages.bind(client));
  const getNetworks = promisify(client.getNetworks.bind(client));

  function createServer(server) {
    Promise.all([
      getFlavors(),
      getImages(),
      getNetworks()
    ]).then(([flavors, images, networks]) => {
      const flavor = find(flavors, { name: server.flavor });
      const image = find(images, { name: server.image });
      const network = {
        uuid: find(networks, { label: server.network }).id
      };
      const opts = {
        name: server.name,
        image: image,
        flavor: flavor,
        networks: [network]
      };
      client.createServer(opts, handleServerResponse);
    });
  }

  return {
    getServers,
    getFlavors,
    getImages,
    getNetworks,
    createServer
  };
}

module.exports = { createClient };
