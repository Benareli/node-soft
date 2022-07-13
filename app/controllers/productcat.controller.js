const db = require("../models");
const ProductCat = db.productcats;
const Log = db.logs;
const User = db.users;
const duplicate = [];

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.catid) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const prodcat = ({catid: req.body.catid, description: req.body.description, 
    active: req.body.active ? req.body.active : false});
  ProductCat.create(prodcat).then(dataa => {
    const log = ({message: "dibuat", category: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Create and Save new
exports.createMany = (req, res) => {
  // Validate request
  duplicate.splice(0,duplicate.length);
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    ProductCat.find({description: reqs[x].nama}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        const prodcat = ({catid: reqs[x].id, description: reqs[x].nama, active: true});
        ProductCat.create(prodcat).then(dataa => {
          const log = ({message: "upload", category: dataa._id, user: users,});
          Log.create(log).then(datab => {
            sequencing(x, reqs, users, res);
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    });
  }else{
    if(duplicate.length>0) res.status(500).send(duplicate);
    else res.status(200).send({message:"Semua data telah diinput!"});
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};

  ProductCat.find(condition)
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

  ProductCat.findById(id)
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
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};

  ProductCat.find(condition)
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

// Find a single with an catid
exports.findByCatId = (req, res) => {
  const catid = req.query.catid;
  var condition = catid ? { catid: { $regex: new RegExp(catid), $options: "i" } } : {};

  ProductCat.find(condition)
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

  ProductCat.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, category: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      };
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

  ProductCat.findByIdAndRemove(id, { useFindAndModify: false })
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
  ProductCat.deleteMany({})
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

// Find all active
exports.findAllActive = (req, res) => {
  ProductCat.find({ active: true }).sort({description:1})
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