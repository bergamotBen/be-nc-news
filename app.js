const express = require("express");

const api = require("./routes/api");

const app = express();

app.use(express.json());
app.use("/api", api);

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
