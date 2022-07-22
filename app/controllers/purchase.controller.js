const db = require("../models");
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Product = db.products;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.purchase_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.partner != "null"){
    const purchaseDat = ({
      purchase_id: req.body.purchase_id,
      date: req.body.date,
      expected: req.body.expected,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      supplier: req.body.supplier,
      warehouse: req.body.warehouse,
      user: req.body.user,
      paid: req.body.paid ? req.body.paid: 0,
      delivery_state: req.body.delivery_state ? req.body.delivery_state: 0,
      open: req.body.open ? req.body.open: true
    });
    Purchase.create(purchaseDat).then(dataa => { 
      const log = ({message: "add", purchase: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(dataa);
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
  }
  else if(req.body.partner == "null"){
    const purchaseDat = ({
      purchase_id: req.body.purchase_id,
      date: req.body.date,
      expected: req.body.expected,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      warehouse: req.body.warehouse,
      user: req.body.user,
      paid: req.body.paid ? req.body.paid: 0,
      delivery_state: req.body.delivery_state ? req.body.delivery_state: 0,
      open: req.body.open ? req.body.open: true
    });
    Purchase.create(purchaseDat).then(dataa => { 
      const log = ({message: "add", purchase: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(dataa);
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
  }

};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};

  Purchase.find(condition)
    .populate({ path: 'supplier', model: Partner })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Purchase.findById(id)
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'user', model: User })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }

  const id = req.params.id;

  Purchase.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: "add", purchase: data._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Purchase.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({
          message: "Deleted successfully!"
        });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Purchase.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{res.status(500).send({message:err.message}); });
};