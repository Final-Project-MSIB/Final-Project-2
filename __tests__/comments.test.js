const request = require("supertest");
const app = require("../index");
const { Users, Photos, Comments } = require("../models");
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

const tempPhoto = {
  poster_image_url: "https://picsum.photos/200/300",
  title: "test",
  caption: "test",
};

let tokens;
let photoId;
let commentId;
let commentId2;

beforeAll(async () => {
  const res = await request(app).post("/users/register").send(tempData);
  const res2 = await request(app).post("/users/register").send(tempData2);
  const login = await request(app).post("/users/login").send(tempData);
  tokens = login.body.token;

  const dataPhoto = {
    poster_image_url: "https://picsum.photos/200/300",
    title: "test",
    caption: "test",
    UserId: 1,
  };
  const photo = await request(app)
    .post("/photos")
    .set("Authorization", `Bearer ${login.body.token}`)
    .send(dataPhoto);
  photoId = photo.body.id;

  const comment = await request(app)
    .post("/comments")
    .send({
      comment: "test",
      PhotoId: photoId,
    })
    .set("Authorization", `Bearer ${tokens}`);
  commentId = comment.body.comment.id;

  const login2 = await request(app)
    .post("/users/login")
    .set("Authorization", `Bearer ${tokens}`)
    .send(tempData2);
  const comment2 = await request(app)
    .post("/comments")
    .send({
      comment: "test",
      PhotoId: photoId,
    })
    .set("Authorization", `Bearer ${login2.body.token}`);
  commentId2 = comment2.body.comment.id;
});

describe("POST /comments", () => {
  it("should return 201 if success", async () => {
    const res = await request(app)
      .post("/comments")
      .send({
        comment: "test",
        PhotoId: photoId,
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment).toHaveProperty("comment");
    expect(res.body.comment).toHaveProperty("UserId");
    expect(res.body.comment).toHaveProperty("PhotoId");
  });
  it("should return 400 if photo id is not integer", async () => {
    const res = await request(app)
      .post("/comments")
      .send({
        comment: "test",
        PhotoId: "",
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).not.toEqual("Failed to create comment");
    expect(res.body.message).not.toEqual(
      "Failed to create comment because of validation error"
    );
  });
  it("should return 400 if photo id is not found", async () => {
    const res = await request(app)
      .post("/comments")
      .send({
        comment: "test",
        PhotoId: 9999,
      })
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Photo not found");
    expect(res.body.message).not.toEqual("Failed to create comment");
    expect(res.body.message).not.toEqual(
      "Failed to create comment because of validation error"
    );
  });
});

describe("GET /comments", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .get("/comments")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("comments");
    expect(res.body.comments).toEqual(expect.arrayContaining([]));
    expect(res.body.comments).not.toEqual(null);
    expect(res.body.comments).not.toEqual(undefined);
  });
});

describe("PUT /comments/:commentId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .put("/comments/" + commentId)
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        comment: "test change",
        PhotoId: photoId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("comment");
    expect(res.body.comment).toHaveProperty("comment");
    expect(res.body.comment).toHaveProperty("UserId");
    expect(res.body.comment).toHaveProperty("PhotoId");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .put("/comments/1")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        comment: "test change",
        PhotoId: photoId,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Comment not found");
    expect(res.body.message).not.toEqual("Failed to update comment");
    expect(res.body.message).not.toEqual(
      "Failed to update comment because of validation error"
    );
  });
  it("should return 400 Bad Request, comment notEmpty", async () => {
    const res = await request(app)
      .put("/comments/" + commentId)
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        comment: "",
        PhotoId: photoId,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Validation notEmpty on comment failed");
    expect(res.body.message).not.toEqual("Failed to update comment");
    expect(res.body.message).not.toEqual(
      "Failed to update comment because of validation error"
    );
  });
  it("should return 400 Bad Request, comment not found", async () => {
    const res = await request(app)
      .put("/comments/99999")
      .set("Authorization", `Bearer ${tokens}`)
      .send({
        comment: "test",
        PhotoId: photoId,
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Comment not found");
    expect(res.body.message).not.toEqual("Failed to update comment");
    expect(res.body.message).not.toEqual(
      "Failed to update comment because of validation error"
    );
  });
});

describe("DELETE /comments/:commentId", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .delete("/comments/" + commentId)
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "Your comment has been successfully deleted"
    );
    expect(res.body.message).not.toEqual("Failed to delete comment");
    expect(res.body.message).not.toEqual("Comment not found");
  });
  it("should return 404 Not Found", async () => {
    const res = await request(app)
      .delete("/comments/99999")
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Comment not found");
    expect(res.body.message).not.toEqual("Failed to delete comment");
  });
  it("should return 401 Unauthorized", async () => {
    const res = await request(app).delete("/comments/1");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Unauthorized");
    expect(res.body.message).not.toEqual("Failed to delete comment");
    expect(res.body.message).not.toEqual("Comment not found");
  });
  it("should return 403 Forbidden", async () => {
    const res = await request(app)
      .delete("/comments/" + commentId2)
      .set("Authorization", `Bearer ${tokens}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "You are not authorized to delete this comment"
    );
    expect(res.body.message).not.toEqual("Failed to delete comment");
    expect(res.body.message).not.toEqual("Comment not found");
  });
});
