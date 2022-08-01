module.exports = app => {
  const products = require("../controllers/product.controller.js");

  var routerProduct = require("express").Router();

  // Create a new
  routerProduct.post("/", products.create);

  // Create a new
  routerProduct.post("/many", products.createMany);

  // Retrieve all
  routerProduct.get("/", products.findAll);

  // Retrieve all active
  routerProduct.get("/active", products.findAllActive);

  // Retrieve all stock
  routerProduct.get("/stock", products.findAllStock);

  // Retrieve all active stock
  routerProduct.get("/activestock", products.findAllActiveStock);

  // Retrieve all inactive fg
  routerProduct.get("/rmready", products.findAllRMStock);

  // Retrieve all PO ready
  routerProduct.get("/poready", products.findAllPOReady);

  // Retrieve a single
  routerProduct.get("/:id", products.findOne);

  // Update with id
  routerProduct.put("/:id", products.update);

  app.use("/api/products", routerProduct);
};