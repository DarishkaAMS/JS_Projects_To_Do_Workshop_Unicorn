const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/get";

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
      name: "list name",
    };

    let list = await TestHelper.executePostCommand("list/create", dtoIn);

    const result = await TestHelper.executeGetCommand(useCase, { id: list.data.id, ...dtoIn });

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      name: "some name",
      anyKey: "??????",
    };

    const errorCode = `uu-todo-main/${useCase}/unsupportedKeys`;

    let list = await TestHelper.executePostCommand("list/create", dtoIn);

    const result = await TestHelper.executeGetCommand(useCase, { id: list.data.id, ...dtoIn });

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(2);

    const errorCode = "uu-todo-wokrshop/list/get/invalidDtoIn";

    const dtoIn = {
      id: "sss",
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      // expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("List does not exist", async () => {
    expect.assertions(2);
    const dtoIn = {
      id: "60e344c9481a5a2ce8401f2e",
    };

    const errorCode =  "uu-todo-wokrshop/list/get/listDoesNotExist";

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      // expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
