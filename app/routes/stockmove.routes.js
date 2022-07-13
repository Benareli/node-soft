module.exports = app => {
  const stockmoves = require("../controllers/stockmove.controller.js");

  var routerSM = require("express").Router();

  // Create a new
  routerSM.post("/", stockmoves.create);

  // Retrieve all
  routerSM.get("/", stockmoves.findAll);

  // Retrieve a single
  routerSM.get("/:id", stockmoves.findOne);

  // Retrieve a single
  routerSM.get("/prod/:product", stockmoves.findByDesc);

  app.use("/api/stockmoves", routerSM);
};