yaml = require("js-yaml");
fs = require("fs");

module.exports = function load(file) {
  const config = yaml.safeLoad(fs.readFileSync(file, "utf8")) || {};
  return {
    servers: config.servers || [],
    networks: config.networks || []
  };
};
