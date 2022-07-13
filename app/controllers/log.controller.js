const db = require("../models");
const Log = db.logs;
const Store = db.stores;
const ProductCat = db.productcats;
const Brand = db.brands;
const Product = db.products;
const Uomcat = db.uomcats;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const User = db.users;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.message) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.brand != "null"){
    const log = new Log({
      message: req.body.message,
      brand: mongoose.Types.ObjectId(req.body.brand),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.category != "null"){
    const log = new Log({
      message: req.body.message,
      category: mongoose.Types.ObjectId(req.body.category),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.product != "null"){
    const log = new Log({
      message: req.body.message,
      product: mongoose.Types.ObjectId(req.body.product),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.uom_cat != "null"){
    const log = new Log({
      message: req.body.message,
      uom_cat: mongoose.Types.ObjectId(req.body.uom_cat),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.uom != "null"){
    const log = new Log({
      message: req.body.message,
      uom: mongoose.Types.ObjectId(req.body.uom),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.partner != "null"){
    const log = new Log({
      message: req.body.message,
      partner: mongoose.Types.ObjectId(req.body.partner),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.warehouse != "null"){
    const log = new Log({
      message: req.body.message,
      warehouse: mongoose.Types.ObjectId(req.body.warehouse),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
  else if(req.body.store != "null"){
    const log = new Log({
      message: req.body.message,
      store: mongoose.Types.ObjectId(req.body.store),
      user: mongoose.Types.ObjectId(req.body.user),
    });
    log.save(log).then(data => {res.send(data);}).catch(err => {res.status(500).send({message:
          err.message || "Some error occurred while creating the Data."});
    });
  }
};



// Retrieve all from the database.
exports.findAll = (req, res) => {
  const message = req.query.message;
  var condition = message ? { message: { $regex: new RegExp(message), $options: "i" } } : {};

  Log.find(condition)
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

  Log.findById(id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
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
exports.findByDesc = (req, res) => {
  const message = req.query.message;
  var condition = message ? { message: { $regex: new RegExp(message), $options: "i" } } : {};

  Log.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
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

  Log.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
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

  Log.findByIdAndRemove(id, { useFindAndModify: false })
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
  Log.deleteMany({})
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