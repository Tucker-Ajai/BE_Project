const express = require("express");
const { fetchCategories } = require("../Models/catergories.model");
const app = express();

exports.getCategories = (request, response,next) =>{
    fetchCategories().then((categories)=>{
        response.status(200).send({categories})
    }).catch((err)=>{
    next(err)
    })
}