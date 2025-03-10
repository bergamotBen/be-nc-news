// const { response } = require("../app");
const {
  readTopics,
  readArticles,
  readArticle,
  createComment,
  readCommentsByArticleId,
  readUsers,
  updateVotes,
  removeCommentById,
  readEndpoints,
  readUser,
  updateCommentVotes,
} = require("../models/models");

const getTopics = (req, res, next) => {
  readTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      console.error("Unhandled error:", err); // Log the full error in production
      next(err); // Pass it to Express error middleware
      //res.status(err.status).send({ msg: err.message });

    });
};
const getArticles = (req, res, next) => {
  const query = req.query;
  readArticles(query)
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
};
const getArticle = (req, res, next) => {
  const articleId = req.params;

  readArticle(articleId.article_id)
    .then((article) => {
      if (article.article === undefined) {
        return next({ status: 404 });
      }
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
const getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params;
  Promise.all([
    readCommentsByArticleId(articleId.article_id),
    readArticle(articleId.article_id),
  ])
    .then((comments) => {
      if (comments[1].article === undefined) {
        return Promise.reject({ status: 404 });
      }
      res.status(200).send({ comments: comments[0] });
    })
    .catch((err) => {
      next(err);
    });
};
const postComment = (req, res, next) => {
  const comment = req.body;
  const articleId = req.params;

  createComment(comment, articleId, next)
    .then((body) => {
      res.status(201).send(body);
    })
    .catch((err) => {
      next(err);
    });
};
const patchVotes = (req, res, next) => {
  const articleId = req.params;
  const incVotes = req.body;
  updateVotes(articleId.article_id, incVotes.inc_votes)
    .then((article) => {
      res.status(202).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
const getUsers = (req, res) => {
  readUsers().then((users) => {
    res.status(200).send({ users });
  });
};
const deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
const getEndpoints = (req, res) => {
  readEndpoints().then((data) => {
    res.status(200).send({ endpoints: data });
  });
};
const getUser = (req, res, next) => {
  username = req.params.username;
  readUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
const patchCommentVotes = (req, res, next) => {
  const commentId = req.params;
  const incVotes = req.body;
  updateCommentVotes(commentId.comment_id, incVotes.inc_votes)
    .then((data) => {
      res.status(202).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  getTopics,
  getArticles,
  getArticle,
  postComment,
  getCommentsByArticleId,
  patchVotes,
  getUsers,
  deleteCommentById,
  getEndpoints,
  getUser,
  patchCommentVotes,
};
