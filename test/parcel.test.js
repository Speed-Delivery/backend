const supertest = require("supertest");
const chai = require("chai");
const app = require("../server"); // Update the path to your Express app

const expect = chai.expect;
const request = supertest(app);

describe("API Tests for Parcel Submission", function () {
  it("should create a new parcel", function (done) {
    request
      .post("/api/parcels")
      .send({
        parcelDescription: "The gift",
        parcelWeight: 23,
        parcelDimension: {
          length: 12,
          width: 12,
          height: 21,
        },
        status: "awaiting pickup",
        sender: {
          name: "John Doe",
          address: "123 Main St, City, Country",
          phone: "0987654321",
          email: "sender@email.com",
        },
        recipient: {
          name: "Mati kif",
          address: "wereda 13, ayat, Yeka subcity",
          phone: "1234567890",
          email: "recepient@email.com",
        },
      })
      .end(function (err, res) {
        if (err) {
          done(err);
          return;
        }
        try {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an("object");
          expect(res.body.parcel).to.have.property("createdAt"); // Check for 'createdAt'
          expect(res.body.parcel).to.have.property("_id"); // Check for 'updatedAt'
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
