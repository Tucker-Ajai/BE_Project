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

exports.fetchReviewsComments = (id) => {
  const regexNum = /^[0-9]+$/;
  if (!regexNum.test(id)) {
    return Promise.reject({ status: 400, msg: "Invalid review ID provided" });
  }
  return db
    .query(
      `SELECT comment_id, comments.votes,comments.created_at,author,body,reviews.review_id FROM reviews inner JOIN comments on reviews.review_id = comments.review_id WHERE reviews.review_id = ($1) ORDER BY created_at DESC
  `,
      [id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        function promise() {
          return db.query(`SELECT * FROM reviews WHERE review_id = ($1)`[id]);
        }

        return Promise.all([promise()])
          .catch(() => {
          })
          .then((result) => {
            if (!result) {
              console.log("result");
              return Promise.reject({
                status: 404,
                msg: "There is no record of review ID provided",
              });
            }
            console.log(result[0].rows);
            // console.log(result[0].result.rows)
            return result[0].rows;
          });
      }

      return comments.rows;
    });
};
