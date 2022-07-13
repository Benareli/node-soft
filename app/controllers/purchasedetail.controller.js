const db = require("../models");
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Qof = db.qofs;
const Stockmove = db.stockmoves;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const purchasedet = ({
    purchase_id: req.body.purchase_id,
    qty: req.body.qty,
    qty_done: req.body.qty_done,
    price_unit: req.body.price_unit,
    discount: req.body.discount,
    tax: req.body.tax,
    subtotal: req.body.subtotal,
    product: req.body.product,
    warehouse: req.body.warehouse
  });
  Purchasedetail.create(purchasedet).then(dataa => { 
    const pur1 = Purchase.findOneAndUpdate({_id:req.body.ids}, {$push: {purchase_detail: dataa._id}}, { useFindAndModify: false })
      .then(datab => { 
          res.send(datab);
      });
  });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};

  Purchasedetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
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

  Purchasedetail.findById(id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
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

  Purchasedetail.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  Purchasedetail.findByIdAndRemove(id, { useFindAndModify: false })
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
  Purchasedetail.deleteMany({})
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