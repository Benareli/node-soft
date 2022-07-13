module.exports = app => {
  const posdetails = require("../controllers/posdetail.controller.js");

  var routerPosDet = require("express").Router();

  // Create a new
  routerPosDet.post("/", posdetails.create);

  // Retrieve all
  routerPosDet.get("/", posdetails.findAll);

  // Retrieve a single
  routerPosDet.get("/:id", posdetails.findOne);

  // Update with id
  routerPosDet.put("/:id", posdetails.update);

  // Delete with id
  routerPosDet.delete("/:id", posdetails.delete);

  // Create new
  routerPosDet.delete("/", posdetails.deleteAll);

  app.use("/api/posdetails", routerPosDet);
};