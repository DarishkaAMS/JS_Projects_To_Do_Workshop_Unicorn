const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/list";

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

    let list = await TestHelper.executePostCommand("list/create",{ name: "some name" });
    const result = await TestHelper.executeGetCommand(useCase, { listId: list.data.id });

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      anyKey: "??????",
    };

    const errorCode = `uu-todo-main/${useCase}/unsupportedKeys`;
    const result = await TestHelper.executeGetCommand(useCase, dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode = "uu-todo-wokrshop/item/list/invalidDtoIn";

    const dtoIn = {
      completed: "sss",
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
