const db = require("../db/connection");
const fs = require("fs/promises");

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
    "comment_count",
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
      `SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.votes, articles.topic, articles.body, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments on comments.article_id = articles.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `,
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
      WHERE article_id=$1
      ORDER BY comments.created_at DESC;`,
      [article_id]
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
const removeCommentById = (commentId) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id =$1
    RETURNING *`,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return { article: rows };
    });
};
const readEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
const readUser = (username) => {
  return db
    .query(
      `SELECT * FROM users
    WHERE username =$1`,
      [username]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
      return data.rows[0];
    });
};
const updateCommentVotes = (commentId, incVotes) => {
  return db
    .query(
      `
UPDATE comments
SET votes = votes + $1
WHERE comment_id = $2
RETURNING *`,
      [incVotes, commentId]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
      return comment.rows[0];
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
  removeCommentById,
  readEndpoints,
  readUser,
  updateCommentVotes,
};
