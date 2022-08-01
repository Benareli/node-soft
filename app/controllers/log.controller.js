const db = require("../models");
const { compare } = require('../function/key.function');
const Log = db.logs;
const Store = db.stores;
const ProductCat = db.productcats;
const Brand = db.brands;
const Product = db.products;
const Uomcat = db.uomcats;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const User = db.users;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body.message) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.brand != "null"){
    const log = new Log({
      message: req.body.message,
      brand: mongoose.Types.ObjectId(req.body.brand),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.category != "null"){
    const log = new Log({
      message: req.body.message,
      category: mongoose.Types.ObjectId(req.body.category),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.product != "null"){
    const log = new Log({
      message: req.body.message,
      product: mongoose.Types.ObjectId(req.body.product),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.uom_cat != "null"){
    const log = new Log({
      message: req.body.message,
      uom_cat: mongoose.Types.ObjectId(req.body.uom_cat),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.uom != "null"){
    const log = new Log({
      message: req.body.message,
      uom: mongoose.Types.ObjectId(req.body.uom),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.partner != "null"){
    const log = new Log({
      message: req.body.message,
      partner: mongoose.Types.ObjectId(req.body.partner),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.warehouse != "null"){
    const log = new Log({
      message: req.body.message,
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.store != "null"){
    const log = new Log({
      message: req.body.message,
      store: mongoose.Types.ObjectId(req.body.store),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
}
};



// Retrieve all from the database.
exports.findAll = (req, res) => {
  const message = req.query.message;
  var condition = message ? { message: { $regex: new RegExp(message), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Log.find(condition)
    .populate({ path: 'user', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Log.findById(req.params.id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const message = req.query.message;
  var condition = message ? { message: { $regex: new RegExp(message), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Log.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Update by the id in the request
exports.update = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  Log.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};