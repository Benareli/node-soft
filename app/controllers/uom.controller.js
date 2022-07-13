const db = require("../models");
const Uom = db.uoms;
const Uomcat = db.uomcats;
const Log = db.logs;
const User = db.users;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.uom_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const uoms = ({uom_name: req.body.uom_name, uom_cat: req.body.uom_cat,
    ratio: req.body.ratio, reference: req.body.reference});
  Uom.create(uoms).then(dataa => {
    const log = ({message: "add", uom: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const uom = req.query.uom;
  var condition = uom ? { uom: { $regex: new RegExp(uom), $options: "i" } } : {};

  Uom.find(condition)
    .populate({ path: 'uom_cat', model: Uomcat })
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

  Uomcat.findById(id)
    .populate({ path: 'uom_cat', model: Uomcat })
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

// Find a single with an desc
exports.findByCat = (req, res) => {
  //const uom = req.query.uom;
  //var condition = uom ? { uom: { $regex: new RegExp(uom), $options: "i" } } : {};

  Uom.find({uom_cat: req.params.uomcat})
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

  Uom.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .populate({ path: 'uom_cat', model: Uomcat })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, uom: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
};