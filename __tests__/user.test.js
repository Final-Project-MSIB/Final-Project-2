const request = require("supertest");
const app = require("../index");
const jsonwebtoken = require("jsonwebtoken");
const { Users } = require("../models");

const JWT_SECRET = "FP2MSIB";

const tempData = {
  username: "test",
  email: "test@test.com",
  password: "test123",
};

const payloadToken = {
  id: 1,
  email: "test@test.com",
  username: "test",
};

const tempToken = jsonwebtoken.sign(payloadToken, JWT_SECRET);

beforeAll(async () => {
  await Users.sync({ force: true });
});

afterAll(async () => {
  await Users.sync({ force: true });
});

describe("POST /users/register", () => {
  it("should return 201 Created", async () => {
    const res = await request(app).post("/users/register").send(tempData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("full_name");
    expect(res.body.user).toHaveProperty("username");
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app).post("/users/register").send(tempData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("email must be unique");
    expect(res.body.error).not.toEqual("username must be unique");
    expect(res.body.error).not.toEqual("full_name must be unique");
  });
});

describe("POST /users/login", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).post("/users/login").send(tempData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).not.toEqual(null);
    expect(res.body.token).not.toEqual(undefined);
    expect(res.body.token).not.toEqual("");
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app).post("/users/login").send({
      email: "test2@test.com",
      password: "test123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Email not found");
    expect(res.body.error).not.toEqual("Wrong Password");
    expect(res.body.error).not.toEqual("Email not valid");
  });
});

describe("PUT /users/:userId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .put("/users/1")
      .set("Authorization", `Bearer ${tempToken}`)
      .send({
        full_name: "hey",
        username: "hey",
        profile_image_url: "https://hey.com",
        age: 20,
        phone_number: "081234567890",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("phone_number");
    expect(res.body.user).toHaveProperty("full_name");
    expect(res.body.user).toHaveProperty("username");
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app)
      .put("/users/1")
      .set("Authorization", `Bearer ${tempToken}`)
      .send({
        full_name: "hey",
        username: "hey",
        profile_image_url: "https://hey.com",
        age: 20,
        phone_number: "081234567890",
      });
    expect(res.statusCode).not.toEqual(400);
    expect(res.body).not.toHaveProperty("error");
    expect(res.body.error).not.toEqual("Email not found");
    expect(res.body.error).not.toEqual("Wrong Password");
    expect(res.body.error).not.toEqual("Email not valid");
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app)
      .put("/users/2")
      .set("Authorization", `Bearer ${tempToken}`)
      .send({
        full_name: "hey",
        username: "hey",
        profile_image_url: "https://hey.com",
        age: 20,
        phone_number: "081234567890",
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Cant modify other user");
    expect(res.body.error).not.toEqual("Email not found");
    expect(res.body.error).not.toEqual("Wrong Password");
    expect(res.body.error).not.toEqual("Email not valid");
  });
});

describe("DELETE /users/:userId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .delete("/users/1")
      .set("Authorization", `Bearer ${tempToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Your account has been successfully deleted"
    );
    expect(res.body.message).not.toEqual("Your account has been successfully");
    expect(res.body.message).not.toEqual("Your account has been");
  });
  it("should return 400 Bad Request if different user", async () => {
    const res = await request(app)
      .delete("/users/2")
      .set("Authorization", `Bearer ${tempToken}`);
    expect(res.statusCode).not.toEqual(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Cant modify other user");
    expect(res.body.error).not.toEqual("Email not found");
    expect(res.body.error).not.toEqual("Wrong Password");
    expect(res.body.error).not.toEqual("Email not valid");
  });
  it("should return 401 Unauthorized if no token", async () => {
    const res = await request(app).delete("/users/2");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Email not found");
    expect(res.body.message).not.toEqual("Wrong Password");
    expect(res.body.message).not.toEqual("Email not valid");
  });
});
