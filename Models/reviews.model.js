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
          .catch(() => {})
          .then((result) => {
            if (!result) {
              return Promise.reject({
                status: 404,
                msg: "There is no record of review ID provided",
              });
            }
            return result[0].rows;
          });
      }

      return comments.rows;
    });
};

exports.fetchAllReviews = (options) => {
  return (
    db

      // LOOK AT PLAYGROUND JS. DRAFT FOR CONDITIONALS THERE. ALWAYS HAVE A WHERE STATEMENT THEN ADD ANDS AS NEEDED
      .query(
        `SELECT owner,title,reviews.review_id,category,review_img_url,reviews.created_at,reviews.votes,designer, COUNT(comments.review_id) AS comment_count FROM reviews left JOIN comments on reviews.review_id = comments.review_id WHERE title LIKE '%' ${
          options.category ? `AND category = '${options.category}' ` : ""
        }
      
      GROUP BY reviews.review_id ORDER BY ${options.sort_by? options.sort_by: "created_at" } ${
        options.order ? `${options.order}` : "DESC"
      }`
      )
      .then((arrOfReviews) => {
        return arrOfReviews;
      })
  );
};

exports.placeAComment = ({ review_id }, { username, body }) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Required fields not been completed",
    });
  }

  const regexNum = /^[0-9]+$/;
  if (!regexNum.test(review_id)) {
    return Promise.reject({ status: 400, msg: "Invalid review ID provided" });
  }
  return db
    .query(
      `INSERT INTO comments ( body, review_id,author)VALUES ( $1, $2 , $3 ) returning *;`,
      [body, review_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      if (err.constraint === "comments_author_fkey") {
        return Promise.reject({
          status: 400,
          msg: "Supplied username is not registerd",
        });
      }
      return err;
    });
};

exports.changeVotes = ({ review_id }, { inc_votes }) => {
  const regexNum = /^[0-9]+$/;
  const regexVote = /^-[0-9]+|^[0-9]+/;
  if (!regexNum.test(review_id)) {
    return Promise.reject({ status: 400, msg: "Invalid review ID provided" });
  }
  if (!regexVote.test(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Invalid vote data provided" });
  }

  return db
    .query(
      `UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1 returning *`,
      [review_id, inc_votes]
    )
    .then((newReview) => {
      return newReview.rows;
    })
    .catch((err) => {
      return err;
    });
};
