const db = require("../db/connection");

const readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((data) => {
    return data.rows;
  });
};

module.exports = { readTopics };
