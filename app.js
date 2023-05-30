const cors = require('cors');
const express = require("express");
const { getApi } = require("./Controllers/api.controller");
const { getCategories } = require("./Controllers/catergories.controller");
const { getReview, getReviewsComments, getAllReviews, postAComment, updateVotes } = require("./Controllers/review.controller");
const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getApi)

app.get("/api/reviews/:review_id", getReview)


app.get("/api/reviews", getAllReviews)

app.get("/api/reviews/:review_id/comments",getReviewsComments)

app.post("/api/reviews/:review_id/comments", postAComment)

app.patch("/api/reviews/:review_id", updateVotes)


app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, request, response, next) => {
  if (err.status === 404) {
    response.status(404).send("The requested endpoint does not yet exist");
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status === 500) {
    response
      .status(500)
      .send(
        "There is currently an issue with the server. Please try again later"
      );
  } else {
    next(err);
  }
});

module.exports = app;
