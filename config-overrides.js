const { override } = require("customize-cra");
const { aliasWebpack } = require("react-app-alias");

module.exports = {
  webpack: override((config) => {
    return aliasWebpack()(config);
  }),
};
