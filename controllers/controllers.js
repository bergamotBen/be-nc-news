const { readTopics, readArticles, readArticle } = require("../models/models");

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

const getArticle = (req, res, next) => {
  const articleId = req.params;

  readArticle(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticles, getArticle };
