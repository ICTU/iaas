yaml = require("js-yaml");
fs = require("fs");

module.exports = function load(file) {
  return yaml.safeLoad(fs.readFileSync(file, "utf8"));
};
