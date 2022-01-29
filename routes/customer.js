const express = require("express");


const customerRouter = express.Router();
const databaseObject = require("../connection");
const ObjectId = require("mongodb").ObjectId;

customerRouter.route("/customers").get(function(request,result) {
    let dbConnectToCollection = databaseObject.getDb();
    dbConnectToCollection.collection("Customers")
    .find({})
    .toArray(function (error, res) {
        if (error) throw error;
        result.json(res);
    })
});

module.exports = customerRouter;