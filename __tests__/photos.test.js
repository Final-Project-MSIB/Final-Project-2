const request = require("supertest");
const app = require("../index");
const { Users, Photos } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

const tempData = {
  username: "test",
  email: "test@test.com",
  password: "test123",
};

const tempPhoto = {
  poster_image_url: "https://picsum.photos/200/300",
  title: "test",
  caption: "test",
};

let tokens;

describe("POST /photos", () => {
  beforeAll(async () => {
    const res = await request(app).post("/users/register").send(tempData);
    const login = await request(app).post("/users/login").send(tempData);
    tokens = login.body.token;

    await Photos.sync({ force: true });
  });
  it("should return 201 if success", async () => {
    const res = await request(app)
      .post("/photos")
      .send(tempPhoto)
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("UserId");
    expect(res.body).toHaveProperty("caption");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("poster_image_url");
    expect(res.body).toHaveProperty("title");
  });
  it("should return 400 if poster_image_url not valid", async () => {
    const res = await request(app)
      .post("/photos")
      .send({
        title: "test",
        caption: "test",
        poster_image_url: "test",
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Validation isUrl on poster_image_url failed"
    );
    expect(res.body.message).not.toEqual("Failed to create photo");
    expect(res.body.message).not.toEqual(
      "Failed to create photo because of validation error"
    );
  });
  it("should return 400 if title empty", async () => {
    const res = await request(app)
      .post("/photos")
      .send({
        title: "",
        caption: "test",
        poster_image_url: "https://picsum.photos/200/300",
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation notEmpty on title failed");
    expect(res.body.message).not.toEqual("Failed to create photo");
    expect(res.body.message).not.toEqual(
      "Failed to create photo because of validation error"
    );
  });
});
describe("GET /photos", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .get("/photos")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("photos");
    expect(res.body.photos).toEqual(expect.arrayContaining([]));
    expect(res.body.photos).not.toEqual(null);
    expect(res.body.photos).not.toEqual(undefined);
    expect(res.body.photos).not.toEqual("");
  });
  it("should return 401", async () => {
    const res = await request(app).get("/photos");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to get photos");
    expect(res.body.message).not.toEqual(
      "Failed to get photos because of error"
    );
  });
});

describe("PUT /photos/:photoId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .put("/photos/1")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        title: "test",
        caption: "test",
        poster_image_url: "https://picsum.photos/200/300",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("photo");
    expect(res.body.photo).toHaveProperty("title");
    expect(res.body.photo).toHaveProperty("caption");
    expect(res.body.photo).toHaveProperty("poster_image_url");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .put("/photos/8")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        title: "",
        caption: "test",
        poster_image_url: "https://picsum.photos/200/300",
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Photo not found");
    expect(res.body.message).not.toEqual("Failed to update photo");
    expect(res.body.message).not.toEqual(
      "Failed to update photo because of validation error"
    );
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).put("/photos/1").send({
      title: "",
      caption: "test",
      poster_image_url: "https://picsum.photos/200/300",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to update photo");
    expect(res.body.message).not.toEqual(
      "Failed to update photo because of validation error"
    );
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app)
      .put("/photos/1")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        title: "",
        caption: "test",
        poster_image_url: "test",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation notEmpty on title failed");
    expect(res.body.message).not.toEqual("Failed to update photo");
    expect(res.body.message).not.toEqual(
      "Failed to update photo because of validation error"
    );
  });
});
describe("DELETE /photos/:photoId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .delete("/photos/1")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Your photo has been successfully deleted"
    );
    expect(res.body.message).not.toEqual("Failed to delete photo");
    expect(res.body.message).not.toEqual(
      "Failed to delete photo because of error"
    );
    expect(res.body.message).not.toEqual("Photo not found");
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).delete("/photos/1");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to delete photo");
    expect(res.body.message).not.toEqual(
      "Failed to delete photo because of error"
    );
    expect(res.body.message).not.toEqual("Photo not found");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .delete("/photos/8")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Photo not found");
    expect(res.body.message).not.toEqual("Failed to delete photo");
    expect(res.body.message).not.toEqual(
      "Failed to delete photo because of error"
    );
  });
  it("should return 500 Internal Server Error", async () => {
    const res = await request(app)
      .delete("/photos/1'1'1'1")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).not.toEqual("Failed to delete photo");
    expect(res.body.message).not.toEqual(
      "Failed to delete photo because of error"
    );
    expect(res.body.message).not.toEqual("Photo not found");
  });
});
