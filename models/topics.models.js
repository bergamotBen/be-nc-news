const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`);
};

module.exports = { readTopics };
