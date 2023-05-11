const express = require("express");
const app = express();
const endpoint = require("../endpoints.json");


exports.getApi = (request, response, next) => {
    response.status(200).send(endpoint);
  };
;
