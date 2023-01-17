const {
  readTopics,
  readArticles,
  readCommentsByArticleId,
} = require("../models/models");

const getTopics = (req, res) => {
  readTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      res.status(err.status).send({ msg: err.message });
    });
};

const getArticles = (req, res) => {
  readArticles()
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => {
      res.status(err.status).send({ msg: err.message });
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params;
  readCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};

module.exports = { getTopics, getArticles, getCommentsByArticleId };
