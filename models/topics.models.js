const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`);
};

const readArticles = () => {};

module.exports = { readTopics, readArticles };
