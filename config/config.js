require("dotenv").config();

module.exports = {
  app: {
    persistence: process.env.PERSISTENCE,
    mongo: process.env.BD,
    file: process.env.FILE_JSON
  },
};