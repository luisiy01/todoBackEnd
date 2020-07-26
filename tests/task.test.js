const request = require("supertest");
const app = require("../app");
const path = "/tasks/";

//use correct token, and correct user to pass these tests
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWYxY2E0MmVhZDNkOWYzMmM0ZTliODUzIiwiaWF0IjoxNTk1NzEzNTcxfQ.ELZGA1zOm93kxML2hjGS9scSwyDsZg4e84sJKfsPx8E'
const userID = "5f1ca42ead3d9f32c4e9b853"; 
const taskID = "5f1ca42ead3d9f32c4e9b853"; 

test("Should get all task for a user", async () => {
  await request(app)
    .get(`${path}`)
    .set({
      "access-token":
        token,
    })
    .expect(200);
});

test("Should create a task for a user", async () => {
    await request(app)
      .post(`${path}add`)
      .set({
        "access-token":
        token,
      })
      .send({
        text : "bla blab asfsdfdsf lablablalb",
        dueDate : "2020-07-23T04:15:15.340Z",
        user_id : userID
    })
      .expect(200);
  });

  test("Should update a task for a user", async () => {
    await request(app)
      .put(`${path}complete/${taskID}`)
      .set({
        "access-token":
        token,
      })
      .expect(200);
  });

  test("Should delete a task for a user", async () => {
    await request(app)
      .delete(`${path}delete/${taskID}`)
      .set({
        "access-token":
        token,
      })
      .expect(200);
  });