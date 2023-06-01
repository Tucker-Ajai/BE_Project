const db = require("../db/connection");

exports.deleteComment = (id) => {
  const regexNum = /^[0-9]+$/;
  if (!regexNum.test(id)) {
    return Promise.reject({ status: 400, msg: "Invalid review ID provided" });
  }

  return db
    .query(`DELETE FROM comments WHERE comment_id = ($1) returning *`, [id])
    .then((comment) => {
      return comment.rows[0]
    }).catch((err)=>{
        next(err)
    })
}

