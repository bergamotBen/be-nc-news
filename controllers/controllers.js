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

const getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params;
  Promise.all([readCommentsByArticleId(article_id), readArticle(article_id)])
    .then((comments) => {
      console.log(comments[1]);
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getArticles, getCommentsByArticleId };
