const db = require("../models");
const Bundle = db.bundles;
const Product = db.products;
const Uom = db.uoms;
const duplicate = [];

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.bundle) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const bundle = ({
    bundle: req.body.bundle,
    qty: req.body.qty,
    uom: req.body.uom,
    product: req.body.product
  });
  Bundle.create(bundle).then(dataa => {
      res.send(dataa);
  }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const bundle = req.query.bundle;
  var condition = bundle ? { bundle: { $regex: new RegExp(bundle), $options: "i" } } : {};

  Bundle.find(condition)
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Bundle.findById(id)
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByProduct = (req, res) => {
  Bundle.find({product: req.params.product})
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByBundle = (req, res) => {
  Bundle.find({bundle: req.params.bundle})
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Bundle.findByIdAndUpdate(id, ({
    bundle: req.body.bundle,
    qty: req.body.qty,
    uom: req.body.uom,
    product: req.body.product
  }), { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else{
        const log = ({message: req.body.message, brand: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      } 
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Bundle.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Deleted successfully!"});
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
};