module.exports = app => {
  const purchasedetails = require("../controllers/purchasedetail.controller.js");

  var routerPurDet = require("express").Router();

  // Create a new
  routerPurDet.post("/", purchasedetails.create);

  // Retrieve all
  routerPurDet.get("/", purchasedetails.findAll);

  // Retrieve a single
  routerPurDet.get("/:id", purchasedetails.findOne);

  // Update with id
  routerPurDet.put("/:id", purchasedetails.update);

  // Delete with id
  routerPurDet.delete("/:id", purchasedetails.delete);

  // Create new
  routerPurDet.delete("/", purchasedetails.deleteAll);

  app.use("/api/purchasedetails", routerPurDet);
};