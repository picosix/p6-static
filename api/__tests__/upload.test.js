const supertest = require("supertest");

const app = require("../src");

describe("Upload image", () => {
  it("jpg", async () => {
    const uploadImageName = "supper-woman.jpg";
    const { body } = await supertest(app)
      .post("/upload")
      .set("Accept", "application/json")
      .attach("images", `__tests__/assets/${uploadImageName}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(body.length).toBe(1);
    const { name } = body[0];
    expect(name.indexOf(uploadImageName)).toBeGreaterThanOrEqual(0);
  });

  it("webp", async () => {
    const uploadImageName = "tree.webp";
    const { body } = await supertest(app)
      .post("/upload")
      .set("Accept", "application/json")
      .attach("images", `__tests__/assets/${uploadImageName}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(body.length).toBe(1);
    const { name } = body[0];
    expect(name.indexOf(uploadImageName)).toBeGreaterThanOrEqual(0);
  });
});
