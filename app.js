const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res.status(err.status).send({ message: err.message });
  }
  next(err);
});

module.exports = app;
