module.exports = app => {
  const uoms = require("../controllers/uom.controller.js");

  var routerUom = require("express").Router();

  // Create a new
  routerUom.post("/", uoms.create);

  // Retrieve all
  routerUom.get("/", uoms.findAll);

  // Retrieve a single
  routerUom.get("/:id", uoms.findOne);

  // Retrieve by category
  routerUom.get("/:id", uoms.findOne);

  // Update with id
  routerUom.get("/uomcat/:uomcat", uoms.findByCat);

  app.use("/api/uoms", routerUom);
};