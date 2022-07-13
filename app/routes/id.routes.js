module.exports = app => {
  const ids = require("../controllers/id.controller.js");

  var routerId = require("express").Router();

  // Retrieve all
  routerId.get("/", ids.findAll);

  // Update with id
  routerId.put("/:id", ids.update);

  app.use("/api/ids", routerId);
};