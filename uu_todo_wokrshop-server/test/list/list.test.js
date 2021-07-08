const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/list";

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
    const result = await TestHelper.executeGetCommand(useCase, dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      pageInfo: {},
      anyKey: 32424,
    };

    const errorCode = "uu-todo-wokrshop/list/list/unsupportedKeys";
    const result = await TestHelper.executeGetCommand(useCase, dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode =  "uu-todo-wokrshop/list/get/invalidDtoIn";

    const dtoIn = {
      pageInfo: "sss",
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
