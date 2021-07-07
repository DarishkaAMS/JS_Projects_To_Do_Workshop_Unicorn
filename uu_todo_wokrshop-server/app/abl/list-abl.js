"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/list-error.js");
const listMain = require("./todo-wokrshop-abl");

const DEFAULTS = {
  pageIndex: 0,
  pageSize: 1000,
};

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
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
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("list");
  }

  async delete(awid, dtoIn) {
    
  }

  async update(awid, dtoIn) {
    // HDS1
    // A1,2
    // await listMain.checkInstance(
    //   awid,
    //   Errors.Update.listInstanceDoesNotExist
    // );
    // HDS2
    // HDS2.1
    const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      // A3
      WARNINGS.updateUnsupportedKeys.code,
      // A4
      Errors.Update.InvalidDtoIn
    );

    const list = await this.dao.get(awid, dtoIn.id);
    // A5
    if (!list) {
      throw new Errors.Update.listDoesNotExist({ uuAppErrorMap }, { listId: dtoIn.id });
    }
    const obj = { ...list, ...dtoIn };

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
    const validationResult = this.validator.validate("listListDtoInType", dtoIn);
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
    const list = await this.dao.list(awid, dtoIn.pageInfo, dtoIn.order);

    // HDS4
    return { ...list, uuAppErrorMap };
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
    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    // HDS2.2,2.3
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    const list = await this.dao.get(awid, dtoIn.id);

    if (!list) {
      throw new Errors.Get.listDoesNotExist(uuAppErrorMap, { listId: dtoIn.id });
    }
    return { list, uuAppErrorMap };
  }

  async create(awid, dtoIn, uuAppErrorMap = {}) {
      // HDS 1
      const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.createUnsupportedKeys.code,
        Errors.Create.InvalidDtoIn
      );
      // const uuObject = {
      //   awid,
      //   ...restDtoIn,
      // };

      // HDS 2
      // 2.1
      let list = null;

      try {
        list = await this.dao.create({...dtoIn, awid});
      } catch (e) {
        throw new Errors.Create.ListDaoCreateFailed(uuAppErrorMap, { dtoIn, cause: e });
      }

      // HDS 3
      return { ...list, uuAppErrorMap }
  }
}

module.exports = new ListAbl();
