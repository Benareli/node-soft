module.exports = app => {
  const users = require("../controllers/useruser.controller.js");

  var routerUserUser = require("express").Router();

  // Create a new
  routerUserUser.post("/", users.create);

  // Retrieve all
  routerUserUser.get("/", users.findAll);

  // Retrieve all active
  routerUserUser.get("/active", users.findAllActive);

  // Retrieve a single
  routerUserUser.get("/:id", users.findOne);

  // Update with id
  routerUserUser.put("/:id", users.update);

  // Delete with id
  routerUserUser.delete("/:id", users.delete);

  // Create new
  routerUserUser.delete("/", users.deleteAll);

  app.use("/api/useruser", routerUserUser);
};