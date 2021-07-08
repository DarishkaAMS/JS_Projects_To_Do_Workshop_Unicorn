"use strict";

const TodoWokrshopUseCaseError = require("./todo-wokrshop-use-case-error.js");
const LIST_ERROR_PREFIX = `${TodoWokrshopUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn in CREATE is not valid.";
    }
  },

  ListDaoCreateFailed: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating a list by list DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${LIST_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Update = {
  UC_CODE: `${LIST_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = "List with this ID does not exist.";
    }
  },
};

const Delete = {
  UC_CODE: `${LIST_ERROR_PREFIX}delete/`,

  InvalidDtoIn: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListNotEmpty: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listNotEmpty`;
      this.message = "List in not empty.";
    }
  },

  ItemDaoDeleteFailed: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Deleting an item by list DAO failed.";
    }
  },

  ListDaoDeleteFailed: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listDaoDeleteFailed`;
      this.message = "Deleting a list by list DAO failed.";
    }
  }
};

module.exports = {
  Delete,
  Update,
  List,
  Get,
  Create
};
