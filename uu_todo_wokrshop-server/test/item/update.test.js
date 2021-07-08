const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/create";
const listCreateUseCase = "list/create";
const listUpdateUseCase = "item/update";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
  await TestHelper.login("Authorities");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${listUpdateUseCase} uuCmd...`, () => {
  test("HDS", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);
    const itemUpdateDtoIn = {
      id: uuItem.data.id,
      listId: uuItem.data.listId,
      text: "test",
    };

    const uuItemUpdate = await TestHelper.executePostCommand(listUpdateUseCase, itemUpdateDtoIn);
    expect(uuItemUpdate.status).toEqual(200);
    expect(uuItemUpdate.data.uuAppErrorMap).toBeDefined();
  });
  test("unsupported keys", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);
    const itemUpdateDtoIn = {
      id: uuItem.data.id,
      listId: uuItem.data.listId,
      text: "test",
      test: "test",
    };
    const errorCode = `uu-todo-main/${listUpdateUseCase}/unsupportedKeys`;
    const uuItemUpdate = await TestHelper.executePostCommand(listUpdateUseCase, itemUpdateDtoIn);
    expect(uuItemUpdate.status).toEqual(200);
    expect(uuItemUpdate.data.uuAppErrorMap).toBeDefined();
    // expect(uuItemUpdate.data.uuAppErrorMap[errorCode]).toBeDefined();
  });
  test("InvalidDtoIn", async () => {
    expect.assertions(3);
    const itemUpdateDtoIn = {
      id: "1",
      listId: "1",
      text: "test",
    };
    const errorCode = `uu-todo-wokrshop/${listUpdateUseCase}/invalidDtoIn`;
    try {
      await TestHelper.executePostCommand(listUpdateUseCase, itemUpdateDtoIn);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
  test("ItemDoesNotExist ", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);
    const itemUpdateDtoIn = {
      id: "60e550f8a0bd310f2055d886",
      listId: uuItem.data.listId,
      text: "test",
    };
    const errorCode = `uu-todo-wokrshop/${listUpdateUseCase}/itemDoesNotExist`;
    try {
      await TestHelper.executePostCommand(listUpdateUseCase, itemUpdateDtoIn);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
  test("ListDoesNotExist  ", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);
    const itemUpdateDtoIn = {
      id: uuItem.data.id,
      listId: "60e550f8a0bd310f2055d886",
      text: "test",
    };
    const errorCode = `uu-todo-wokrshop/${listUpdateUseCase}/listDoesNotExist`;
    try {
      await TestHelper.executePostCommand(listUpdateUseCase, itemUpdateDtoIn);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
});
