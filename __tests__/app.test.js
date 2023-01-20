const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const sorted = require("jest-sorted");

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

describe("GET /api/articles", () => {
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

        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");

          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  it("returns articles ordered by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("returns 200 and the requested article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");

        expect(body.article.article_id).toBe(1);
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });
  it("returns 400 when given an invalid :article_id", () => {
    return request(app)
      .get("/api/articles/article")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 404 when given a valid but nonexistent :article_id", () => {
    return request(app)
      .get("/api/article/123")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("returns status 200 and an object containing an array of comments with the relevant data", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        body.comments.map((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");

          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  it("returns 400 and invalid type when given an invalid :article_id", () => {
    return request(app)
      .get("/api/articles/article1/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 404 and not found when given a valid but nonexistent path", () => {
    return request(app)
      .get("/api/articles/1234/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("returns a status of 201 and the comment body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "an inspirational read" })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          body: "an inspirational read",
        });
      });
  });
  it("appears in the comments table", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "an inspirational read" })
      .expect(201)
      .then(({ body }) => {
        return db
          .query(`SELECT * FROM comments WHERE comment_id = 19;`)
          .then(({ data }) => {
            expect(body).toEqual({ body: "an inspirational read" });
          });
      });
  });
  it("returns 400 if username key is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "an inspirational read" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("incomplete");
      });
  });
  it("returns 400 if body key is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "bergamotBen" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("incomplete");
      });
  });
  it("returns 400 given a bad article_id", () => {
    return request(app)
      .post("/api/articles/article/comments")
      .send({ username: "butter_bridge", body: "an inspirational read" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 404 given a valid but nonexistent article_id", () => {
    return request(app)
      .post("/api/articles/1234/comments")
      .send({ username: "butter_bridge", body: "an inspirational read" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("returns a staus of 202 and responds with the article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(202)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("article_img_url");

        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });
  it("increments votes by the inc_votes value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(202)
      .then(({ body }) => {
        expect(body.article.votes).toBe(101);
      });
  });
  it("rejects patches of invalid type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "vote" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 400 when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/article")

      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 404 when given a valid but nonexistent article id", () => {
    return request(app)
      .patch("/api/articles/1234")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});

describe("GET /api/articles/article_id (comment_count)", () => {
  it("return 200 and a key of comment count ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
      });
  });
});

describe("GET /api/users", () => {
  it("responds with a status 200 and an object with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");

          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  it("returns a status of 200 and an object with an array of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toHaveProperty("GET /api");
        expect(body.endpoints).toHaveProperty("GET /api/topics");
        expect(body.endpoints).toHaveProperty("GET /api/articles");
        expect(body.endpoints).toHaveProperty("GET /api/articles/:article_id");
        expect(body.endpoints).toHaveProperty(
          "GET /api/articles/:article_id/comments"
        );
        expect(body.endpoints).toHaveProperty(
          "POST /api/articles/:article_id/comments"
        );
        expect(body.endpoints).toHaveProperty(
          "PATCH /api/articles/:article_id"
        );
        expect(body.endpoints).toHaveProperty("GET /api/users");
        expect(body.endpoints).toHaveProperty(
          "DELETE /api/comments/:comment_id"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("return a status of 204 and no content in db ", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db
          .query(`SELECT * FROM comments WHERE comment_id = 1;`)
          .then((result) => {
            expect(result.rows).toHaveLength(0);
          });
      });
  });
  it("returns 400 and rejects invalid types", () => {
    return request(app)
      .delete("/api/comments/comment")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid type");
      });
  });
  it("returns 404 and not found for valid but nonexistent requests", () => {
    return request(app)
      .delete("/api/comments/1234")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  it("returns 200 and the requested user", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toBeInstanceOf(Object);
        expect(body.user).toHaveProperty("username");
        expect(body.user).toHaveProperty("avatar_url");
        expect(body.user).toHaveProperty("name");

        expect(body.user.username).toBe("lurker");
        expect(typeof body.user.avatar_url).toBe("string");
        expect(typeof body.user.name).toBe("string");
      });
  });
  it("returns 404 when given a valid but nonexistent username", () => {
    return request(app)
      .get("/api/users/123")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});
