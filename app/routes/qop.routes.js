module.exports = app => {
  const qops = require("../controllers/qop.controller.js");

  var routerQop = require("express").Router();

  // Create a new
  routerQop.post("/", qops.create);

  // Retrieve all
  routerQop.get("/", qops.findAll);

  // Retrieve a single
  routerQop.get("/id/:id", qops.findOne);
  
  // Retrieve a single
  routerQop.get("/prod/:product/:warehouse", qops.findByProduct);
  
  // Update with id
  routerQop.post("/cu", qops.createUpdate);

  app.use("/api/qops", routerQop);
};