module.exports = app => {
  const purchases = require("../controllers/purchase.controller.js");

  var routerPur = require("express").Router();

  // Create a new
  routerPur.post("/", purchases.create);

  // Retrieve all
  routerPur.get("/", purchases.findAll);

  // Retrieve a single
  routerPur.get("/:id", purchases.findOne);

  // Update with id
  routerPur.put("/:id", purchases.update);

  // Delete with id
  routerPur.delete("/:id", purchases.delete);

  // Create new
  routerPur.delete("/", purchases.deleteAll);

  app.use("/api/purchases", routerPur);
};