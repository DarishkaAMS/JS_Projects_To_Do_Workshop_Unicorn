"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {

  async createSchema(){
    await super.createIndex({ awid: 1, listid: 1, completed:1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, _id: id });
  }

  async list(awid, pageInfo) {
    return await super.find({ awid }, pageInfo);
  }

  async update({ awid, id, ...uuObject }) {
    return await super.findOneAndUpdate({ awid, _id: id }, uuObject);
  }

  async complete({ awid, id, ...uuObject }) {
    return await super.findOneAndUpdate({ awid, _id: id }, uuObject);
  }

  async listByList(filter, pageInfo) {
    return await super.find(filter, pageInfo);
  }

  async listByListIdAndCompleted(filter, pageInfo) {
    return await super.find(filter, pageInfo);
  }

  async deleteMany(awid, id) {
    return await super.deleteMany({ awid, id });
  }

  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }
}

module.exports = ItemMongo;
