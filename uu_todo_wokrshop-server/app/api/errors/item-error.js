"use strict";

const TodoWokrshopUseCaseError = require("./todo-wokrshop-use-case-error.js");
const ITEM_ERROR_PREFIX = `${TodoWokrshopUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with this ID does not exist.";
    }
  },
};

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${ITEM_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ItemDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDoesNotExist`;
      this.message = "Item does not exist.";
    }
  },

  ListDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = "List does not exist.";
    }
  },
};

const Complete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}complete/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}itemDoesNotExist`;
      this.message = "Item does not exist.";
    }
  },
};

const Delete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}delete/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}itemDoesNotExist`;
      this.message = "Item does not exist.";
    }
  },
};

module.exports = {
  Delete,
  Complete,
  Update,
  List,
  Get,
  Create
};
