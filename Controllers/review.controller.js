const express = require("express");
const { fetchReview } = require("../Models/reviews.model");
const app = express();

exports.getReview = (request, response, next) => {
  fetchReview(request.params.review_id)
    .then((table) => {
      response.status(200).send(table[0] );
    })
    .catch((err) => {
      next(err);
    });
};
