const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

// describe("get /api/treasures", () => {
//     it("status 200 and responses with all treasures", () => {
//       return request(app)
//         .get("/api/treasures")
//         .expect(200)
//         .then(({ body }) => {
//           expect(body).toBeInstanceOf(Array);
//         });

describe("GET /api/topics", () => {
  it("returns a status 200 and responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
      });
  });
  it("returns objects with slug and description keys.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body[0]).toHaveProperty("slug");
        expect(body[0]).toHaveProperty("description");
      });
  });
});

/* tests

the array should contain objects with the slug and the description

*/
