const { readTopics, readArticles } = require("../models/models");

const getTopics = (req, res) => {
  return readTopics().then((rows) => {
    res.status(200).send({ topics: rows });
  });
};

const getArticles = (req, res) => {
  return readArticles().then((rows) => {
    res.status(200).send({ articles: rows });
  });
};

module.exports = { getTopics, getArticles };
