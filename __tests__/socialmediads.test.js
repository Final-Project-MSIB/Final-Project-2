const request = require("supertest");
const app = require("../index");
const { Users, Photos, Comments, SocialMedias } = require("../models");
const jsonwebtoken = require("jsonwebtoken");

const tempData = {
  username: "test",
  email: "test@test.com",
  password: "test123",
};

const tempData2 = {
  username: "testd",
  email: "testd@test.com",
  password: "testd123",
};

let tokens;
let photoId;
let socialMediaId;
let socialmediaotherId;

beforeAll(async () => {
  const res = await request(app).post("/users/register").send(tempData);
  const res2 = await request(app).post("/users/register").send(tempData2);
  const login = await request(app).post("/users/login").send(tempData);
  tokens = login.body.token;

  const login2 = await request(app).post("/users/login").send(tempData2);

  const socialemdias = await request(app)
    .post("/socialmedias")
    .send({
      name: "twitter",
      social_media_url: "https://twitter.com",
    })
    .set("Authorization", `Bearer ${login.body.token}`);

  socialMediaId = socialemdias.body.social_media.id;

  const socialmedia = await request(app)
    .post("/socialmedias")
    .send({
      name: "facebook",
      social_media_url: "https://facebook.com",
    })
    .set("Authorization", `Bearer ${login2.body.token}`);
  socialmediaotherId = socialmedia.body.social_media.id;
});

describe("POST /socialmedias", () => {
  it("should return 201 if success", async () => {
    const res = await request(app)
      .post("/socialmedias")
      .send({
        name: "facebook",
        social_media_url: "https://facebook.com",
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("social_media");
    expect(res.body.social_media).toHaveProperty("name");
    expect(res.body.social_media).toHaveProperty("social_media_url");
    expect(res.body.social_media).toHaveProperty("UserId");
  });
  it("should return 400 if name empty", async () => {
    const res = await request(app)
      .post("/socialmedias")
      .send({
        name: "",
        social_media_url: "https://facebook.com",
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation notEmpty on name failed");
    expect(res.body.message).not.toEqual("Validation error");
    expect(res.body.message).not.toEqual("Failed to create social media");
  });
  it("should return 401 if token not valid", async () => {
    const res = await request(app)
      .post("/socialmedias")
      .send({
        name: "facebook",
        social_media_url: "https://facebook.com",
      })
      .set("Authorization", `Bearer ${tokens}a`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to create social media");
    expect(res.body.message).not.toEqual("Validation error");
  });
});

describe("GET /socialmedias", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .get("/socialmedias")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("social_medias");
    expect(res.body.social_medias).not.toEqual(null);
    expect(res.body.social_medias).not.toEqual(undefined);
    expect(res.body.social_medias).not.toEqual("");
  });
});

describe("PUT /socialmedias/:socialMediaId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .put(`/socialmedias/${socialMediaId}`)
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        name: "facebook",
        social_media_url: "https://facebook.com",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("social_media");
    expect(res.body.social_media).toHaveProperty("name");
    expect(res.body.social_media).toHaveProperty("social_media_url");
    expect(res.body.social_media).toHaveProperty("UserId");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .put("/socialmedias/40")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        name: "facebook",
        social_media_url: "https://facebook.com",
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Social Media Not Found");
    expect(res.body.message).not.toEqual("Failed to change social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).put(`/socialmedias/${socialMediaId}`).send({
      name: "facebook",
      social_media_url: "https://facebook.com",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to change social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app)
      .put(`/socialmedias/${socialMediaId}`)
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        name: "",
        social_media_url: "https://facebook.com",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation notEmpty on name failed");
    expect(res.body.message).not.toEqual("Failed to change social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
});
describe("DELETE /socialmedias/:socialMediaId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .delete(`/socialmedias/${socialMediaId}`)
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Your social media has been successfully deleted"
    );
    expect(res.body.message).not.toEqual("Failed to delete social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .delete("/socialmedias/40")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Social Media Not Found");
    expect(res.body.message).not.toEqual("Failed to delete social media");
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).delete(`/socialmedias/${socialMediaId}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to delete social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
  it("should return 401 Unauthorized if edit another id", async () => {
    const res = await request(app)
      .delete(`/socialmedias/${socialmediaotherId}`)
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "You are not authorized to delete this social media"
    );
    expect(res.body.message).not.toEqual("Failed to delete social media");
    expect(res.body.message).not.toEqual("Social media not found");
  });
});
