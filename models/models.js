const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

const readArticles = () => {
  return db.query(`SELECT * FROM articles;`).then((data) => {
    db.query(
      `SELECT article_id, COUNT(*) AS "Number of Comments"
    FROM comments
    GROUP BY article_id;`
    ).then((commentsCount) => {
      referenceTable = createReferenceTable(commentsCount.rows);
      console.log(commentsCount.rows);
      console.log(data.rows);
    });
    return data.rows;
  });
};
module.exports = { readTopics, readArticles };
