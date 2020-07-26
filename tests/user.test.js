const request = require("supertest");
const app = require("../app");
const path = "/auth/user/";

//change the email and password values to create a new user
test("Should register a user", async () => {
  await request(app)
    .post(`${path}register`)
    .send({
      email: "luisnunez91@gmail.com",
      password: "12345678",
    })
    .expect(200);
});

test("Should not register an existed user", async () => {
  await request(app)
    .post(`${path}register`)
    .send({
      email: "luisnunez91@gmail.com",
      password: "12345678",
    })
    .expect(400);
});

test("Should log in a user", async () => {
  await request(app)
    .post(`${path}login`)
    .send({
      email: "luisnunez91@gmail.com",
      password: "12345678",
    })
    .expect(200);
});

test("Should not log in a user with wrong pass", async () => {
  await request(app)
    .post(`${path}login`)
    .send({
      email: "luisnunez91@gmail.com",
      password: "12378",
    })
    .expect(401);
});

test("Should not log in a user does not exists", async () => {
  await request(app)
    .post(`${path}login`)
    .send({
      email: "aaaluisnunez91@gmail.com",
      password: "12378daf",
    })
    .expect(401);
});