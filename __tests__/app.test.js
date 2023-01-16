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

describe.only("GET /api/articles", () => {
  it("returns a status 200 and an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
      });
  });
  it("returns objects from the articles table with the correct keys ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        expect(body.articles[0]).toHaveProperty("author");
        expect(body.articles[0]).toHaveProperty("title");
        expect(body.articles[0]).toHaveProperty("article_id");
        expect(body.articles[0]).toHaveProperty("topic");
        expect(body.articles[0]).toHaveProperty("created_at");
        expect(body.articles[0]).toHaveProperty("votes");
        expect(body.articles[0]).toHaveProperty("article_img_url");
      });
  });
  it("returns the comment_count by article_id from the reference table ", () => {});
});
