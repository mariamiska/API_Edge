const request = require("supertest");
const app = require("./server");
const expect = require("chai").expect;

describe("API Tests", () => {
  it("should return a welcome message", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal("Bienvenido a la API");
        done();
      });
  });

  it("should return all posts", (done) => {
    request(app)
      .get("/posts")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should return a specific post", (done) => {
    request(app)
      .get("/posts/1")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body.id).to.equal(1);
        done();
      });
  });
});
