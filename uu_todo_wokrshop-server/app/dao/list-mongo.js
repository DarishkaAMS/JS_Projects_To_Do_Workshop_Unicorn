"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {

  async createSchema(){
  }

  async create(uuObject) {
    if (uuObject.categoryList) {
      uuObject.categoryList = uuObject.categoryList.map(categoryId => new ObjectId(categoryId));
    }
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
}

module.exports = ListMongo;
