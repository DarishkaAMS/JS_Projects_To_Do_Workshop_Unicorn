const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/get";

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
  test("HDS", async () => {
    const dtoIn = {
      name: "Do Something",
    };

    const list = await TestHelper.executePostCommand("list/create", dtoIn);
    const result = await TestHelper.executeGetCommand(useCase, {id: list.id});

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      name: "Do Something",
      title: "Some title"
    };

    const list = await TestHelper.executePostCommand("list/create", dtoIn);
    const result = await TestHelper.executeGetCommand(useCase, {id: list.id});

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(2);

    // const errorCode = `uu-todo-workshop/${useCase}/invalidDtoIn`;

    const dtoIn = {
      name: 3333,
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      // expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }

  });

});
