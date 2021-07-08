"use strict";
// const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/list-error.js");
// const listMain = require("./todo-wokrshop-abl");

const DEFAULTS = {
  pageIndex: 0,
  pageSize: 1000,
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

  deleteUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("list");
    this.dao.item = DaoFactory.getDao("item");
  }

  async delete(awid, dtoIn) {
    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    )

    // 1.4
    if (!("forceDelete" in dtoIn)) dtoIn.forceDelete = false;

    // HDS 2
    const id = dtoIn.id;
    const uuList = await this.dao.get(awid, id);
    if (!uuList) throw new Errors.Delete.ListDoesNotExist(uuAppErrorMap, { id });

    // HDS 3
    const filter = { awid, listId: id };
    const uuItemsList = await this.dao.item.listByList(filter);
    // 3.1
    if (!dtoIn.forceDelete) {
      const itemLength = uuItemsList.itemList.length;
      if (itemLength) {
        throw new Errors.Delete.ListNotEmpty(uuAppErrorMap, { list: id, numberOfItems: uuItemsList.pageInfo.total });
      }
      try {
        await this.dao.delete(awid, id);
      } catch (error) {
        throw new Errors.Delete.ListDaoDeleteFailed(uuAppErrorMap, { cause: error });
      }
      // 3.2
    } else {
      try {
        await this.dao.item.deleteMany(awid, id);
      } catch (error) {
        throw new Errors.Delete.ItemDaoDeleteFailed({ cause: error });
      }
      // HDS 4
      try {
        await this.dao.delete(awid, id);
      } catch (error) {
        throw new Errors.Delete.ListDaoDeleteFailed(uuAppErrorMap, { cause: error });
      }
    }
    // HDS 5
    return { uuAppErrorMap };
  }

  async update(awid, dtoIn) {

    // HDS 1
    // 1.1, 1.2, 1.3
    const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);

    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2
    const list = await this.dao.get(awid, dtoIn.id);
    // A3
    if (!list) {
      throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap }, { listId: dtoIn.id });
    }

    // A4
    const obj = { ...list, ...dtoIn };
    let restDtoIn = {};
    restDtoIn = {
      ...obj,
    };
    let uuObject = await this.dao.update(restDtoIn);;

    // 2.3
    return { ...uuObject, uuAppErrorMap }
  }

  async list(awid, dtoIn) {

    // HDS 1 (1.1 - 1.3)
    // A1,2
    const validationResult = this.validator.validate("listListDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 1.4
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;

    // HDS 2
    const list = await this.dao.list(awid, dtoIn.pageInfo);

    // HDS 3
    return { ...list, uuAppErrorMap };
  }

  async get(awid, dtoIn) {

    // HDS1
    // A1, 2
    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2
    // A3
    const list = await this.dao.get(awid, dtoIn.id);
    if (!list) {
      throw new Errors.Get.ListDoesNotExist(uuAppErrorMap, { listId: dtoIn.id });
    }

    // HDS 3
    return { list, uuAppErrorMap };
  }

  async create(awid, dtoIn, uuAppErrorMap = {}) {

      // HDS 1
      // A1, 2
      const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.createUnsupportedKeys.code,
        Errors.Create.InvalidDtoIn
      );

      const uuObject = {
        awid,
        ...dtoIn,
      };

      // HDS 2
      // A3
      let list = null;
      try {
        list = await this.dao.create({...uuObject, awid});
      } catch (e) {
        throw new Errors.Create.ListDaoCreateFailed(uuAppErrorMap, { dtoIn, cause: e });
      }

      // HDS 3
      return { ...list, uuAppErrorMap }
  }
}

module.exports = new ListAbl();
