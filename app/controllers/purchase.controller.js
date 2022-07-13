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
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.partner != "null"){
    const purchase = ({
      purchase_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      supplier: req.body.supplier,
      user: req.body.user,
      paid: req.body.paid ? req.body.active : false,
      open: req.body.open,
    });
    Purchase.create(purchase).then(dataa => { 
      const log = ({message: "add", purchase: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
  }
  else if(req.body.partner == "null"){
    const pos = ({
      purchase_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      user: req.body.user,
      paid: req.body.paid ? req.body.active : false,
      open: req.body.open,
    });
    Purchase.create(purchase).then(dataa => { 
      const log = ({message: "add", purchase: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
  }

};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};

  Purchase.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
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
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Data with id=" + id });
    });
};

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Purchase.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
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
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete with id=" + id
      });
    });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Purchase.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all data."
      });
    });
};