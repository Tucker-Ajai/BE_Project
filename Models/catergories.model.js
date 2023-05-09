const format = require("pg-format");
const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((data) => {
    if (data.rows.length === 0){
        Promise.reject({status: 404, msg:"Unable to locate requested content"})
    }
    return data.rows
  });
};
