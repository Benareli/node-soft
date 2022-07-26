module.exports = app => {
  const ids = require("../controllers/id.controller.js");

  var routerId = require("express").Router();

  // Retrieve all
  routerId.get("/", ids.findAll);

  // Get POSess_ID all
  routerId.get("/posessid", ids.findPOSessId);

  // Get POS_ID all
  routerId.get("/posid", ids.findPOSId);

  // Get Payment_ID all
  routerId.get("/paymentid", ids.findPaymentId);

  // Update with id
  routerId.put("/:id", ids.update);

  app.use("/api/ids", routerId);
};