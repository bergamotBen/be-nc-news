const { readTopics, readArticles, readArticle } = require("../models/models");
const {
  readTopics,
  readArticles,
  readCommentsByArticleId,
  readArticle,
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
const getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params;
  Promise.all([readCommentsByArticleId(article_id), readArticle(article_id)])
    .then((comments) => {
      if (comments[1].article === undefined) {
        return Promise.reject({ status: 404, msg: "uh oh" });
      }
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticles, getCommentsByArticleId };
