const format = require("pg-format");
const db = require("../db/connection");

exports.fetchReview = (id) => {
  const regexNum = /^[0-9]+$/;
  if (!regexNum.test(id)) {
    return Promise.reject({ status: 400, msg: "Invalid review ID provided" });
  }

  return db
    .query(`SELECT * FROM reviews WHERE review_id = ($1);`, [id])
    .then((table) => {
      if (table.rows.length === 0) {
        return Promise.reject({ status: 200, msg: "No matching review id" });
      }

      return table.rows;
    });
};
