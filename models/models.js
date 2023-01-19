const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

const readArticles = (query) => {
  const validSorts = [
    "author",
    "title",
    "topic",
    "article_id",
    "created_at",
    "votes",
  ];
  const validOrders = ["ASC", "DESC"];

  const topic = query.topic;

  const order = query.order || "DESC";

  const sortBy = !query.sort_by
    ? "created_at"
    : validSorts.filter((sort) => {
        return sort === query.sort_by;
      });

  const orderArray = validOrders.find((validOrder) => {
    return validOrder === order.toUpperCase();
  });

  const orderBy = !query.order
    ? "DESC"
    : orderArray === undefined || orderArray.length > 0
    ? orderArray
    : "ERROR";
  const queryValues = [];
  let queryString = `SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.votes, articles.topic, COUNT(comments.article_id) AS comment_count
  FROM articles       
  LEFT JOIN comments on comments.article_id = articles.article_id`;
  if (topic) {
    queryString += `
      WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryString += `  
    GROUP BY articles.article_id
    ORDER BY articles.${sortBy} ${orderBy};`;
  return db.query(queryString, queryValues).then((articles) => {
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
      if (rows === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
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
module.exports = {
  readTopics,
  readArticles,
  readArticle,
  createComment,
  readCommentsByArticleId,
};
