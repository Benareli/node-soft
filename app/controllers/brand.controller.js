const db = require("../models");
const { compare } = require('../function/key.function');
const Brand = db.brands;
const Log = db.logs;
const User = db.users;
const duplicate = [];

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const brand = ({description: req.body.description, active: req.body.active ? req.body.active : false});
  Brand.create(brand).then(dataa => {
    const log = ({message: "dibuat", brand: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
}
};

// Create and Save new
exports.createMany = (req, res) => {
  // Validate request
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  duplicate.splice(0,duplicate.length);
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Brand.find({description: reqs[x].nama}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        const brand = ({description: reqs[x].nama, active: true});
        Brand.create(brand).then(dataa => {
          const log = ({message: "upload", brand: dataa._id, user: users,});
          Log.create(log).then(datab => {
            sequencing(x, reqs, users, res);
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    });
  }else{
    if(duplicate.length>0){res.status(500).send(duplicate);duplicate.splice(0,duplicate.length);}
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
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Brand.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Brand.findById(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Brand.find(condition)
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

  Brand.findByIdAndUpdate(req.params.id, ({description: req.body.description, 
    active: req.body.active ? req.body.active : false}), { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else{
        const log = ({message: req.body.message, brand: req.params.id, user: req.body.user,});
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
  }
};

// Find all active
exports.findAllActive = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Brand.find({ active: true }).sort({description:1})
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};