module.exports = app => {
  const taxs = require("../controllers/tax.controller.js");

  var routerTax = require("express").Router();

  // Create a new
  routerTax.post("/", taxs.create);

  // Retrieve all
  routerTax.get("/", taxs.findAll);

  // Retrieve all active
  routerTax.get("/active", taxs.findAllActive);

  // Retrieve a single
  routerTax.get("/:id", taxs.findOne);

  // Update with id
  routerTax.put("/:id", taxs.update);

  // Delete with id
  routerTax.delete("/:id", taxs.delete);

  // Create new
  routerTax.delete("/", taxs.deleteAll);

  app.use("/api/taxs", routerTax);
};