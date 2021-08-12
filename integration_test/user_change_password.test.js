process.env.NODE_ENV = "integration";

const dbHandler = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../src/app");
const status = require("http-status");

beforeAll(async () => await dbHandler.connect());
beforeAll(async () => await fixtureLoader.load());
afterAll(async () => await dbHandler.closeDatabase());

async function loginAsTom(password, agent) {
  let email = fixtures.users.tom.email;
  let response = await agent
    .post("/api/user/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(status.OK);
}

test("Change password on the current user", async () => {
  const agent = request.agent(app);

  await loginAsTom(fixtures.users.tom.password, agent);

  const newPassword = "new-password";
  const updatedUser = {
    password: newPassword
  };

  let response = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser });

  expect(response.statusCode).toBe(status.OK);

  const agent2 = request(app);
  await loginAsTom(newPassword, agent2);
});
