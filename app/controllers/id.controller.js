const db = require("../models");
const Id = db.ids;
const mongoose = require("mongoose");

// Retrieve all from the database.
exports.findAll = (req, res) => {
  Id.find(req.query.pos_id)
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

  Id.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {res.send({ message: "Updated successfully."});
       
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
};