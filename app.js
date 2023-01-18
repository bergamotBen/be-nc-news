const express = require("express");
const {
  getTopics,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ message: "Bad request" });
  }

  if (err.status === 404) {
    return res.status(err.status).send({ message: "Not found" });
  }
  next(err);
});
app.use((req, res, next) => {
  res.status(404).send({ message: "Not found" });
});

module.exports = app;
