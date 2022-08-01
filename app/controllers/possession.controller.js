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
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  const possession = ({
    session_id: req.body.session_id,
    store: req.body.store,
    time_open: req.body.time_open,
    time_close: req.body.time_close,
    shift: req.body.shift,
    start_balance: req.body.start_balance,
    end_balance: req.body.start_balance,
    store: req.body.store,
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
}
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const session_id = req.query.session_id;
  var condition = session_id ? { session_id: { $regex: new RegExp(session_id), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
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
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Possession.findById(req.params.id)
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an user
exports.findByAllOpen = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Possession.find({open: true})
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an user
exports.findByUser = (req, res) => {
  const user = req.params.user;
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Possession.find({user: user})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an user open
exports.findByUserOpen = (req, res) => {
  const users = req.params.user;
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Possession.find({user: users, open: true})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an user open
exports.findByUserClose = (req, res) => {
  const users = req.params.user;
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Possession.find({user: users, open: false})
    .populate({ path: 'pos', model: Pos })
    .populate({ path: 'payment', model: Payment })
    .populate({ path: 'user', model: User })
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
  Possession.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};