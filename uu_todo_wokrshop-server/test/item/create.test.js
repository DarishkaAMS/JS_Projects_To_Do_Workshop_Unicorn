const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/create";
const listCreateUseCase = "list/create";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U" });
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test.only("HDS", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);
    expect(uuItem.status).toEqual(200);
    expect(uuItem.data.uuAppErrorMap).toBeDefined();
  });
  test.only("unsupported keys", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);

    const errorCode = `uu-todo-main/${listCreateUseCase}/unsupportedKeys`;

    expect(uuItem.status).toEqual(200);
    expect(uuItem.data.uuAppErrorMap).toBeDefined();
    // expect(uuItemUpdate.data.uuAppErrorMap[errorCode]).toBeDefined();
  });
  test.only("InvalidDtoIn", async () => {
    expect.assertions(3);
    const itemCreateDtoIn = {
      listId: "1",
      text: "AWESOMEST Morewrqtning!!!"
    };
    const errorCode = `uu-todo-wokrshop/${listCreateUseCase}/invalidDtoIn`;
    try {
      await TestHelper.executePostCommand(listCreateUseCase, itemCreateDtoIn);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
  test.only("ItemDoesNotExist ", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      // listId: uuList.data.id,
      listId: uuList.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);

    const errorCode = `uu-todo-wokrshop/${listCreateUseCase}/ItemDoesNotExist`;
    try {
      await TestHelper.executePostCommand(useCase, uuItem);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
  test.only("ListDoesNotExist  ", async () => {
    const listCreateDtoIn = {
      name: "test",
    };

    const uuList = await TestHelper.executePostCommand(listCreateUseCase, listCreateDtoIn);

    const itemCreateDtoIn = {
      listId: uuList.data.id,
      text: "test",
    };

    const uuItem = await TestHelper.executePostCommand(useCase, itemCreateDtoIn);

    const errorCode = `uu-todo-wokrshop/${listCreateUseCase}/listDoesNotExist`;
    try {
      await TestHelper.executePostCommand(useCase, uuItem);
    } catch ({ status, code, dtoOut }) {
      expect(status).toEqual(400);
      expect(code).toEqual(errorCode);
      expect(dtoOut.uuAppErrorMap).toBeDefined();
      // expect(dtoOut.uuAppErrorMap[errorCode]).toBeDefined();
    }
  });
});
