const db = require("../models");
const { compare } = require('../function/key.function');
const Qof = db.qofs;
const Product = db.products;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if(req.body.partner != "null"){
    const qof = new Qof({
      product: mongoose.Types.ObjectId(req.body.product),
      partner: mongoose.Types.ObjectId(req.body.partner),
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      qof: req.body.qof,
      uom: req.body.uom
    });
    qof.save(qof).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  if(req.body.partner == "null"){
    const qof = new Qof({
      product: mongoose.Types.ObjectId(req.body.product),
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      qof: req.body.qof,
      uom: req.body.uom
    });
    qof.save(qof).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
}
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qof.find(condition)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qof.findById(req.params.id)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qof.find(condition)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};