"use strict";
const TodoWokrshopAbl = require("../../abl/todo-wokrshop-abl.js");

class TodoWokrshopController {
  init(ucEnv) {
    return TodoWokrshopAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodoWokrshopController();
