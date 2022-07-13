module.exports = app => {
  const payments = require("../controllers/payment.controller.js");

  var routerPay = require("express").Router();

  // Create a new
  routerPay.post("/", payments.create);

  // Retrieve all
  routerPay.get("/", payments.findAll);

  // Retrieve a single
  routerPay.get("/:id", payments.findOne);

  // Update with id
  routerPay.put("/:id", payments.update);

  // Delete with id
  routerPay.delete("/:id", payments.delete);

  // Create new
  routerPay.delete("/", payments.deleteAll);

  app.use("/api/payments", routerPay);
};