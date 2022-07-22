const db = require("../models");
const Journal = db.journals;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
var journid;
var journalid;
var journalcount;
//const mongoose = require("mongoose");

// Retrieve all from the database.
exports.findAll = (req, res) => {
  Entry.find()
    .populate({ path: 'debit_acc', model: Coa })
    .populate({ path: 'credit_acc', model: Coa })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Entry.findById(id)
    .populate({ path: 'debit_acc', model: Coa })
    .populate({ path: 'credit_acc', model: Coa })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByJournal = (req, res) => {
  Entry.find({journal_id: req.params.journal})
    .populate({ path: 'debit_acc', model: Coa })
    .populate({ path: 'credit_acc', model: Coa })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};