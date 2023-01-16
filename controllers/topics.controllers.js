const { readTopics, readArticles } = require("../models/topics.models");

const getTopics = (req, res) => {
  return readTopics().then(({ rows }) => {
    res.status(200).send(rows);
  });
};
const getArticles = (req, res) => {
  readArticles();
};
module.exports = { getTopics, getArticles };
