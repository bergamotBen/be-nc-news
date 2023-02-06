const cors = require("cors");
const express = require("express");
const {
  getTopics,
  getArticles,
  getArticle,
  postComment,
  getCommentsByArticleId,
  patchVotes,
  getUsers,
  deleteCommentById,
  getEndpoints,
  patchCommentVotes,
  getUser,
} = require("./controllers/controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchVotes);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api", getEndpoints);
app.get("/api/users/:username", getUser);
app.patch("/api/comments/:comment_id", patchCommentVotes);

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    return res.status(400).send({ message: "incomplete" });
  }
  if (err.code === "22P02") {
    return res.status(400).send({ message: "invalid type" });
  }
  if (err.code === "23503") {
    return res.status(404).send({ message: "not found" });
  }
  if (err.code === "42703") {
    return res.status(400).send({ message: "invalid type" });
  }
  if (err.code === "42601") {
    return res.status(400).send({ message: "invalid type" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.status === 404) {
    return res.status(err.status).send({ message: "Not found" });
  }
  next(err);
});
app.use((req, res, next) => {
  res.status(404).send({ message: "not found" });
});

module.exports = app;
