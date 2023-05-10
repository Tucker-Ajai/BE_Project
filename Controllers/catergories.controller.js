const express = require("express");
const app = express();
const { fetchCategories } = require("../Models/catergories.model");

exports.getCategories = (request, response,next) =>{
    fetchCategories().then((categories)=>{
        response.status(200).send({categories})
    }).catch((err)=>{
    next(err)
    })
}