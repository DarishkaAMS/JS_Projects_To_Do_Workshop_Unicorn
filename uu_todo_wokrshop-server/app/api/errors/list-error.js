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

  listInstanceDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listInstanceDoesNotExist`;
      this.message = "ListInstance does not exist.";
    }
  },

  ListDaoCreateFailed: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listCreateDaoFailed`;
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
  listDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}jokeDoesNotExist`;
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
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  listInstanceDoesNotExist: class extends TodoWokrshopUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}listInstanceDoesNotExist`;
      this.message = "ListInstance does not exist.";
    }
  },
};

const Delete = {
  UC_CODE: `${LIST_ERROR_PREFIX}delete/`,
  
};

module.exports = {
  Delete,
  Update,
  List,
  Get,
  Create
};
