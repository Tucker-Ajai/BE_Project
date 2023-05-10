const express = require("express");
const { getCategories } = require("./Controllers/catergories.controller");
const { getReview } = require("./Controllers/review.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview)





app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, request, response, next) => {
 if (err.status === 404){
  response.status(404).send("The requested endpoint does not yet exist")
 }
else{
  next(err)
} });

app.use((err, request, response, next) => {
  if(err.status === 500){
 response.status(500).send("There is currently an issue with the server. Please try again later")
  
}
else{
  next(err)
}});

module.exports = app;
