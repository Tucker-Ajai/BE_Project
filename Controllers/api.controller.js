const express = require("express");
const { fetchApi } = require("../Models/api.model");

const app = express();

exports.getApi = (request, response, next) => {
  
    response.status(200).send(fetchApi());
  };
;
