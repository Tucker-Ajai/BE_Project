const { fetchReview, fetchAllReviews } = require("../Models/reviews.model");

exports.getReview = (request, response, next) => {
  fetchReview(request.params.review_id)
    .then((table) => {
      response.status(200).send(table[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (request, response, next) => {
  fetchAllReviews().then((reviews) => {
    response.status(200).send(reviews);
  });
};
