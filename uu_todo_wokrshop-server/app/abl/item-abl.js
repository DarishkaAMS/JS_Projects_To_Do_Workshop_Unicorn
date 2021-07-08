"use strict";
// const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ItemMain = require("./todo-wokrshop-abl");

const Errors = require("../api/errors/item-error.js");

const DEFAULTS = {
  pageIndex: 0,
  pageSize: 1000,
  completed: true
};

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  completeUnsupportedKeys: {
    code: `${Errors.Complete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
  }

  async delete(awid, dtoIn) {
    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2 - We don't check instance

    // HDS 3
    // 3.1
    const item = await this.dao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Delete.ItemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }

    // HDS 4
    // 4.1
    const dtoOut = await this.dao.delete(awid, dtoIn.id);

    // HDS 5
    return { ...dtoOut, uuAppErrorMap };
  }

  async complete(awid, dtoIn) {

    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemCompleteDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.completeUnsupportedKeys.code,
      Errors.Complete.InvalidDtoIn
    );

    // HDS 2 - We don't check instance

    // HDS 3
    // HDS 3.1
    const item = await this.dao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Complete.ItemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }

    // HDS 4
    if (!dtoIn.hasOwnProperty("completed")) {
      dtoIn.completed = false;
    }
    const obj = { ...item, ...dtoIn };
    let restDtoIn = {
      ...obj,
    };
    let uuObject = await this.dao.update(restDtoIn);

    // HDS 5
    return { ...uuObject, uuAppErrorMap }
  }

  async update(awid, dtoIn) {

    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 - We don't check Instance

    // HDS 3
    // 3.1
    const item = await this.dao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }

    // HDS 4
    // 4.1
    let list = await this.listDao.get(awid, dtoIn.listId);
    if (!list) {
      throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap });
    }

    // HDS 5
    const obj = { ...item, ...dtoIn };
    let restDtoIn = {... obj};
    let updatedList = await this.dao.update(restDtoIn);;

    // HDS 5
    return { ...updatedList, uuAppErrorMap }
  }

  async list(awid, dtoIn) {
    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemListDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - We don't check instance

    // HDS 3
    // 3.1, 3.2, 3.3
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;

    // const item = await this.dao.list(awid, dtoIn.pageInfo);
    let uuItemList;
    let filter = { awid };
    // 2.1
    // 2.2
    // 2.3
    if (dtoIn.listId || "completed" in dtoIn) {
      if (dtoIn.listId) filter.listId = dtoIn.listId;
      if ("completed" in dtoIn) filter.completed = dtoIn.completed;
      console.log("fiter", filter)
      uuItemList = await this.dao.listByListIdAndCompleted(filter, dtoIn.pageInfo);
    } else {
      // 2.4
      uuItemList = await this.dao.listByList(filter, dtoIn.pageInfo);
    }
    // HDS4
    return { ...uuItemList, uuAppErrorMap };
  }

  async get(awid, dtoIn) {
    // HDS1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    const item = await this.dao.get(awid, dtoIn.id);

    // HDS 2

    // HDS 3
    if (!item) {
      throw new Errors.Get.ItemDoesNotExist(uuAppErrorMap, { itemId: dtoIn.id });
    }

    // HDS 4
    return { item, uuAppErrorMap };
  }

  async create(awid, dtoIn) {

    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2
    // HDS 3

    // HDS 4
    // 4.1
    let list = await this.listDao.get(awid, dtoIn.listId);
    if (!list) throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap });

    // HDS 5
    // 5.1.A, 5.1.B
    const { ...restDtoIn } = dtoIn;

    const uuObject = {
      awid,
      ...restDtoIn,
    };
    let dtoOut = await this.dao.create({ ...uuObject })

    // HDS 6
    return { ...dtoOut, uuAppErrorMap };
  }

}

module.exports = new ItemAbl();
