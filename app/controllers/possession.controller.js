const db = require("../models");
const Possession = db.possessions;
const Pos = db.poss;
const Payment = db.payments;
const User = db.users;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.session_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const possession = ({
    session_id: req.body.session_id,
    store: req.body.store,
    time_open: req.body.time_open,
    time_close: req.body.time_close,
    shift: req.body.shift,
    start_balance: req.body.start_balance,
    end_balance: req.body.start_balance,
    money_in: 0,
    money_out: 0,
    total_discount: 0,
    total_amount_untaxed: 0,
    total_amount_tax: 0,
    total_amount_total: 0,
    user: req.body.user,
    open: req.body.open
  });
  Possession.create(possession).then(dataa => { res.send(dataa);});

};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const session_id = req.query.session_id;
  var condition = session_id ? { session_id: { $regex: new RegExp(session_id), $options: "i" } } : {};

  Possession.find(condition)
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'user', model: User })
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

  Possession.findById(id)
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
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

// Find a single with an user
exports.findByAllOpen = (req, res) => {
  Possession.find({open: true})
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

// Find a single with an user
exports.findByUser = (req, res) => {
  const user = req.params.user;
  
  Possession.find({user: user})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
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

// Find a single with an user open
exports.findByUserOpen = (req, res) => {
  const users = req.params.user;
  
  Possession.find({user: users, open: true})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
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

// Find a single with an user open
exports.findByUserClose = (req, res) => {
  const users = req.params.user;
  
  Possession.find({user: users, open: false})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
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

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Possession.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  Possession.findByIdAndRemove(id, { useFindAndModify: false })
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
  Possession.deleteMany({})
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