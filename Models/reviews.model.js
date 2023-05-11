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
 return db.query(
    `SELECT owner,title,reviews.review_id,category,review_img_url,reviews.created_at,reviews.votes,designer, COUNT(comments.review_id) AS comment_count FROM reviews left JOIN comments on reviews.review_id = comments.review_id group by reviews.review_id ORDER BY created_at DESC `
  ).then((arrOfReviews) => {
      return arrOfReviews;
    });
};
