const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/get";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test("HDS - SHO TAM", async () => {
    const dtoIn = {
      text: "some text",
    };
    let list = await TestHelper.executePostCommand("list/create",{ name: "some name" });
    let item = await TestHelper.executePostCommand("item/create", { listId: list.data.id, ...dtoIn });
    const result = await TestHelper.executeGetCommand(useCase, { id: item.data.id });

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      anyKey: "??????",
    };

    const errorCode = `uu-todo-main/${useCase}/unsupportedKeys`;

    let list = await TestHelper.executePostCommand("list/create", { name: "some name" });
    let item = await TestHelper.executePostCommand("item/create", { listId: list.data.id, text: "some text"});
    const result = await TestHelper.executeGetCommand(useCase, { id: item.data.id, ...dtoIn });

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode = "uu-todo-wokrshop/item/get/invalidDtoIn";

    const dtoIn = {
      id: "sss",
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("Item does not exist", async () => {
    expect.assertions(3);
    const dtoIn = {
      id: "60e344c9481a5a2ce8401f2e",
    };

    const errorCode = "uu-todo-wokrshop/item/get/itemDoesNotExist"
    ;

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
