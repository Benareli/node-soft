const db = require("../models");
const { compare } = require('../function/key.function');
const Store = db.stores;
const Warehouse = db.warehouses;
const Log = db.logs;
const User = db.users;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const store = ({store_name: req.body.store_name, store_addr: req.body.store_addr, 
    store_phone: req.body.store_addr, warehouse: req.body.warehouse,
    active: req.body.active ? req.body.active : false});
  Store.create(store).then(dataa => {
    const log = ({message: "add", store: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
}
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const store_name = req.query.store_name;
  var condition = store_name ? { store_name: { $regex: new RegExp(store_name), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.find(condition)
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.findById(req.params.id)
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const store_name = req.query.store_name;
  var condition = store_name ? { store_name: { $regex: new RegExp(store_name), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.find(condition)
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
  Store.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, store: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.findByIdAndRemove(req.params.id, { useFindAndModify: false })
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
  }
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find all active
exports.findAllActive = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Store.find({ active: true })
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};