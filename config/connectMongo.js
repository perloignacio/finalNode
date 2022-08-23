const mongoose = require("mongoose");

const config = require("../config/config");

class connectMongo {
  constructor() {
    this.connected = true;
    this.client = mongoose;
  }
  connect = async () => {
    try {
      await this.client.connect(config.app.mongo);
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = connectMongo;
