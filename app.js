const express = require("express");
const { getTopics, getArticle } = require("./controllers/topics.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

module.exports = app;
