const { promisify } = require("util");
const pkgcloud = require("pkgcloud");
const { find, assign } = require("lodash");

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
  const computeClient = pkgcloud.providers.openstack.compute.createClient(opts);
  const networkClient = pkgcloud.providers.openstack.network.createClient(opts);

  const getServers = promisify(computeClient.getServers.bind(computeClient));
  const getFlavors = promisify(computeClient.getFlavors.bind(computeClient));
  const getImages = promisify(computeClient.getImages.bind(computeClient));
  const getNetworks = promisify(computeClient.getNetworks.bind(computeClient));

  const createSubnet = promisify(
    networkClient.createSubnet.bind(networkClient)
  );
  const getNetwork = promisify(networkClient.getNetwork.bind(networkClient));

  function createNetwork(network) {
    networkClient.createNetwork(network, (err, net) => {
      return new Promise((resolve, reject) => {
        if (err) {
          reject(err);
        } else {
          const subnets = network.subnets || [];
          const subs = subnets.map(subnet => {
            const s = assign(
              {
                networkId: net.id,
                ipVersion: 4
              },
              subnet
            );
            return createSubnet(s);
          });
          Promise.all(subs).then(getNetwork(net)).catch(console.error);
        }
      });
    });
  }

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
      computeClient.createServer(opts, handleServerResponse);
    });
  }

  return {
    getServers,
    getFlavors,
    getImages,
    getNetworks,
    createServer,
    createNetwork
  };
}

module.exports = { createClient };
