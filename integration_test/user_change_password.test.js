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

let jwtToken;

async function loginAsTom(password) {
  let email = fixtures.users.tom.email;
  let response = await request(app)
    .post("/api/user/login")
    .send({ user: { email, password } });

  expect(response.statusCode).toBe(status.OK);
  jwtToken = response.body.user.token;
}

test("Change password on the current user", async () => {
  await loginAsTom(fixtures.users.tom.password);

  const newPassword = "new-password";
  const updatedUser = {
    password: newPassword
  };

  let response = await request(app)
    .put("/api/user/change_password")
    .set("Authorization", "Bearer " + jwtToken)
    .send({ user: updatedUser });

  expect(response.statusCode).toBe(status.OK);

  await loginAsTom(newPassword);
});
