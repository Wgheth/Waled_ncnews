const db  = require("../db/connection");

const readTopics = () => {
  return db.query("SELECT * FROM topics")
    .then((result) => {
     return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};


module.exports = { readTopics };