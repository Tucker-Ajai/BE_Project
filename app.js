const express = require("express");
const { getCategories } = require("./Controllers/catergories.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);




app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
 response.status(500).send("There is currently an issue witht the server. Please try again later")
  });

module.exports = app;
