const { readTopics } = require("../models/topics.models");

const getTopics = (req, res) => {
  return readTopics().then((rows) => {
    res.status(200).send({ topics: rows });
  });
};

const getArticle = (req, res) => {
  res.sendStatus(200);
};

module.exports = { getTopics, getArticle };
