const db = require("../db/connection");

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
      [articleId.article_id]
    )
    .then(({ rows }) => {
      return { article: rows[0] };
    })
    .catch(() => {
      return Promise.reject({ status: 400, message: "Bad request" });
    });
};
module.exports = { readTopics, readArticles, readArticle };
