const express = require("express");
const router = express.Router();
const {
  getTopics,
  getArticles,
  getArticle,
  postComment,
  getCommentsByArticleId,
  patchVotes,
  getUsers,
  deleteCommentById,
  getEndpoints,
} = require("../controllers/controllers");

router.route("").get(getEndpoints);

router.route("/articles").get(getArticles);

router.route("/articles/:article_id").get(getArticle).patch(patchVotes);

router
  .route("/articles/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

router.route("/comments/:comment_id").delete(deleteCommentById);

router.route("/users").get(getUsers);

router.route("/topics").get(getTopics);

module.exports = router;
