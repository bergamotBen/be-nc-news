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

module.exports = app;
