module.exports = app => {
  const journals = require("../controllers/journal.controller.js");

  var routerJour = require("express").Router();

  // Retrieve all
  routerJour.get("/", journals.findAll);

  // Retrieve a single
  routerJour.get("/id/:id", journals.findOne);

  app.use("/api/journals", routerJour);
};