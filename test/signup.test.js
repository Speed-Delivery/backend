const supertest = require("supertest");
const chai = require("chai");
const app = require("../server"); // Update the path to your Express app

const expect = chai.expect;
const request = supertest(app);

describe("API Tests for user creation", function () {
  it("should create a new user or handle duplicates", function (done) {
    request
      .post("/api/users")
      .send({
        username: "user123",
        email: "user123@example.com",
        password: "YourSecurePassword123!",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
          return;
        }
        try {
          if (res.status === 201) {
            expect(res.body).to.be.an("object");
            expect(res.body.user).to.have.property("token");
            expect(res.body.user).to.have.property("_id");
          } else if (res.status === 409) {
            console.log("User already exists, response status 409 received.");
          } else {
            throw new Error("Unexpected response status: " + res.status);
          }
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
