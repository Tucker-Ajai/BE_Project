const {
  fetchReview,
  fetchReviewsComments,
  fetchAllReviews,
  placeAComment,
  changeVotes,
} = require("../Models/reviews.model");

exports.getReview = (request, response, next) => {
  fetchReview(request.params.review_id)
    .then((table) => {
      response.status(200).send(table[0]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsComments = (request, response, next) => {
  const id = request.params.review_id;

  fetchReviewsComments(id)
    .then((comments) => {
      response.status(200).send({ reviewComments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (request, response, next) => {
  fetchAllReviews(request.query).then((reviews) => {
    response.status(200).send({ review: reviews });
  });
};

exports.postAComment = (request, response, next) => {
  placeAComment(request.params, request.body)
    .then((addedComment) => {
      response.status(201).send({ addedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (request, response, next) => {
  changeVotes(request.params, request.body)
    .then((editedReview) => {
      response.status(200).send({ editedReview });
    })
    .catch((err) => {
      next(err);
    });
};
