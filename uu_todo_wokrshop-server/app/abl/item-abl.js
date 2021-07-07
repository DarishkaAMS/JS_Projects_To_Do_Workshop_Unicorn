"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

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
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  completeUnsupportedKeys: {
    code: `${Errors.Complete.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
  }

  async delete(awid, dtoIn) {
    const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      // A3
      WARNINGS.deleteUnsupportedKeys.code,
      // A4
      Errors.Delete.InvalidDtoIn
    );

    const item = await this.dao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.Delete.itemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }
    const dtoOut = await this.dao.delete(awid, dtoIn.id);
    // HDS8
    return { ...dtoOut, uuAppErrorMap };
  }

  async complete(awid, dtoIn) {

    const validationResult = this.validator.validate("itemCompleteDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      // A3
      WARNINGS.completeUnsupportedKeys.code,
      // A4
      Errors.Complete.InvalidDtoIn
    );

    // let list = await this.listDao.get(awid, dtoIn.listId);
    // if (!list) {
    //   throw new Errors.Create.listDoesNotExist({ uuAppErrorMap });
    // }

    const item = await this.dao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Complete.itemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }

    // if (!dtoIn.completed) dtoIn.completed = DEFAULTS.completed;
    if (!dtoIn.hasOwnProperty("completed")) {
      dtoIn.completed = false;
    }

    const obj = { ...item, ...dtoIn };

    let restDtoIn = {};
    restDtoIn = {
      ...obj,
    };
    let updatedList = await this.dao.update(restDtoIn);

    return { ...updatedList, uuAppErrorMap }
  }

  async update(awid, dtoIn) {
    const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      // A3
      WARNINGS.updateUnsupportedKeys.code,
      // A4
      Errors.Update.InvalidDtoIn
    );

    let list = await this.listDao.get(awid, dtoIn.listId);
    if (!list) {
      throw new Errors.Create.listDoesNotExist({ uuAppErrorMap });
    }

    const item = await this.dao.get(awid, dtoIn.id);
    if (!item) {
      throw new Errors.Update.itemDoesNotExist({ uuAppErrorMap }, { itemId: dtoIn.id });
    }
    const obj = { ...item, ...dtoIn };

    let restDtoIn = {};
    restDtoIn = {
      ...obj,
    };
    let updatedList = await this.dao.update(restDtoIn);;

    return { ...updatedList, uuAppErrorMap }
  }

  async list(awid, dtoIn) {
    // HDS 1
    // A1,2
    // const listInstance = await listMain.checkInstance(
    //   awid,
    //   Errors.List.listInstanceDoesNotExist
    // );
    const validationResult = this.validator.validate("itemListDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    // HDS2.4

    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;

    // HDS3
    const item = await this.dao.list(awid, dtoIn.pageInfo, dtoIn.order);

    // HDS4
    return { ...item, uuAppErrorMap };
  }

  async get(awid, dtoIn) {
    // HDS1
    // A1,2
    // const listInstance = await listMain.checkInstance(
    //   awid,
    //   Errors.Get.listInstanceDoesNotExist
    // );
    // HDS2
    // HDS2.1
    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    // HDS2.2,2.3
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    const item = await this.dao.get(awid, dtoIn.id);

    if (!item) {
      throw new Errors.Get.itemDoesNotExist(uuAppErrorMap, { itemId: dtoIn.id });
    }
    return { item, uuAppErrorMap };
  }

  async create(awid, dtoIn) {

    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    let list = await this.listDao.get(awid, dtoIn.listId);

    if (!list) throw new Errors.Create.listDoesNotExist({ uuAppErrorMap });

    const { ...restDtoIn } = dtoIn;

    const uuObject = {
      awid,
      ...restDtoIn,
    };
    let dtoOut = await this.dao.create({ ...uuObject, awid });
    // HDS5
    return { ...dtoOut, uuAppErrorMap };
  }

}

module.exports = new ItemAbl();
