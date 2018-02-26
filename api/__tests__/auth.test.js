const supertest = require("supertest");

const app = require("../src");
const { auth } = require("../src/settings");

describe("Authorization", () => {
  let token;

  it("login with fixed username and password", async () => {
    const { body } = await supertest(app)
      .post("/login")
      .send(auth)
      .expect(200);

    expect(typeof body.token === "string").toBe(true);

    token = body.token;
  });

  it("access protected url with token", async () => {
    const { body } = await supertest(app)
      .get("/statictis")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});
