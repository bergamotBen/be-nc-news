const express = require("express");
const {
  getTopics,
  getArticles,
  getArticle,
} = require("./controllers/controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((req, res, next) => {
  res.status(404).send({ message: "Not found." });
});

module.exports = app;
