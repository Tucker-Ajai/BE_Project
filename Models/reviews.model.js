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

exports.fetchAllReviews = () => {
  const promisOne = db.query(
    `SELECT owner,title,review_id,category,review_img_url,created_at,votes,designer FROM reviews ORDER BY created_at DESC `
  );
  const promiseTwo = db.query(`SELECT review_id FROM comments `);
  return Promise.all([promisOne, promiseTwo])
    .then((reviews) => {
      for (let i = 0; i < reviews[0].rows.length; i++) {
        reviews[0].rows[i].comment_count = 0;
      }
      for (let t = 0; t < reviews[0].rows.length; t++) {
        for (let z = 0; z < reviews[1].rows.length; z++) {
          if (reviews[1].rows[z].review_id === reviews[0].rows[t].review_id) {
            reviews[0].rows[t].comment_count++;
          }
        }
      }

      return reviews[0].rows;
    })
    .then((arrOfReviews) => {
      return arrOfReviews;
    });
};
