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

describe("GET /api/topics", () => {
  it("returns a status 200 and responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
      });
  });
  it("returns objects with slug and description keys.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        expect(body.topics[0]).toHaveProperty("slug");
        expect(body.topics[0]).toHaveProperty("description");
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  it("returns 200 and the requested article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        //this test is incomplete//
      });
  });
});
