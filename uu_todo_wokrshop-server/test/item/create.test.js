const { TestHelper } = require("uu_appg01_server-test");

const useCase = "item/create";

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
      listId: "60e58930a64d3405bc4ab436",
      text: "Create TESTS for ITEM CREATE"
    };

    const result = await TestHelper.executePostCommand(useCase, dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test.only("unsupported keys", async () => {


    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    // expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(2);

    // const errorCode = `uu-todo-workshop/${useCase}/invalidDtoIn`;

    const dtoIn = {
      listId: 60e58930,
      text: "Create TESTS for ITEM CREATE"
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn);
    } catch (e) {
      expect(e.status).toEqual(400);
      // expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }

  });

});
