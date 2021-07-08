const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/delete";

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
  // test("HDS - SHO TAM", async () => {
  //
  //   let list = await TestHelper.executePostCommand("list/create", { name: "some name" });
  //
  //   // let item = await TestHelper.executePostCommand("item/create", { listId: list.data.id, text: "some text" });
  //   const result = await TestHelper.executePostCommand(useCase, { id: list.id });
  //
  //   expect(result.status).toEqual(200);
  //   expect(result.data.uuAppErrorMap).toBeDefined();
  // });


  test("unsupported keys", async () => {
    const errorCode = `uu-todo-main/${useCase}/unsupportedKeys`;
    let list = await TestHelper.executePostCommand("list/create",{ name: "some name" });
    let item = await TestHelper.executePostCommand("item/create", { listId: list.data.id, text: "some text" });

    const dtoIn = {
      id: item.data.id,
      someKey: "some value",
    };

    const result = await TestHelper.executePostCommand(useCase, dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });
  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode = "uu-todo-wokrshop/item/delete/invalidDtoIn";

    const dtoIn = {
      id: "sss",
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("Item does not exist", async () => {
    expect.assertions(3);
    const errorCode = "uu-todo-wokrshop/item/complete/itemDoesNotExist";
    const dtoIn = {
      id: "60e5924ec464c43160b2f722",
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
