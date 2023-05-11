const express = require("express");
const { fetchReview, fetchReviewsComments } = require("../Models/reviews.model");
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

exports.getReviewsComments = (request, response, next) => {
  const id = request.params.review_id

fetchReviewsComments(id).then((comments)=>{

response.status(200).send({reviewComments:comments})
}).catch((err) => {
 // console.log(err)
  next(err);
});


}
