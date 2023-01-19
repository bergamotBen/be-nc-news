const db = require("../db/connection");
const fs = require("fs/promises");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};
const readArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.votes, articles.topic, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then((articles) => {
      return articles.rows;
    });
};
const readArticle = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM articles WHERE article_id=$1`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows === 0) {
        return Promise.reject({ status: 404 });
      }
      return { article: rows[0] };
    });
};
const readCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE article_id=$1`,
      [article_id.article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};
const createComment = (comment, articleId) => {
  return db
    .query(
      `INSERT INTO comments
      (body, author, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING body`,
      [comment.body, comment.username, articleId.article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
const updateVotes = (articleId, incVotes) => {
  return db
    .query(
      `
  UPDATE articles
SET votes = votes + $1
WHERE article_id = $2
RETURNING *`,
      [incVotes, articleId]
    )
    .then((votes) => {
      if (votes.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
    })
    .then(() => {
      return readArticle(articleId);
    });
};
const readUsers = () => {
  return db
    .query(
      `
  SELECT * FROM users`
    )
    .then((data) => {
      return data.rows;
    });
};
const readEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
module.exports = {
  readTopics,
  readArticles,
  readArticle,
  createComment,
  readCommentsByArticleId,
  updateVotes,
  readUsers,
  readEndpoints,
};
