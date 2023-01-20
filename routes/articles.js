const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticle,
  postComment,
  getCommentsByArticleId,
  patchVotes,
} = require("../controllers/controllers");

router.route("").get(getArticles);

router.route("/:article_id").get(getArticle);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

router.route("/:article_id").patch(patchVotes);

module.exports = router;
