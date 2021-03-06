const db = require("../models");
const { compare } = require('../function/key.function');
const Partner = db.partners;
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

  const partner = ({
    code: req.body.code,
    name: req.body.name,
    phone: req.body.phone,
    isCustomer: req.body.isCustomer ? req.body.isCustomer : false,
    isSupplier: req.body.isSupplier ? req.body.isSupplier : false,
    active: req.body.active ? req.body.active : false
  });
  Partner.create(partner).then(dataa => {
    const log = ({message: "dibuat", partner: dataa._id, user: req.body.user,});
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
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Partner.find({name: reqs[x].nama}).then(data => {
      if(data.length>0){}
      else{
        if((reqs[x].pelanggan=="ya"||reqs[x].pelanggan=="Ya"||reqs[x].pelanggan=="YA")
          &&(reqs[x].supplier=="ya"||reqs[x].supplier=="Ya"||reqs[x].supplier=="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: true,isSupplier: true,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);});
          });
        }else if((reqs[x].pelanggan!="ya"||reqs[x].pelanggan!="Ya"||reqs[x].pelanggan!="YA")
          &&(reqs[x].supplier=="ya"||reqs[x].supplier=="Ya"||reqs[x].supplier=="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: false,isSupplier: true,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);});
          });
        }else if((reqs[x].pelanggan=="ya"||reqs[x].pelanggan=="Ya"||reqs[x].pelanggan=="YA")
          &&(reqs[x].supplier!="ya"||reqs[x].supplier!="Ya"||reqs[x].supplier!="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: true,isSupplier: false,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);});
          });
        }else{
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: false,isSupplier: false,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);});
          });
        }
      }
    });
  }else{res.send({message:"Semua data telah diinput!"})}
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.findById(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find(condition)
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

  Partner.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, partner: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find all active
exports.findAllActive = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find({ active: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find all customer
exports.findAllCustomer = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find({ isCustomer: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find all supplier
exports.findAllSupplier = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find({ isSupplier: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};


// Find all active customer
exports.findAllActiveCustomer = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find({ active: true, isCustomer: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find all active supplier
exports.findAllActiveSupplier = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Partner.find({ active: true, isSupplier: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};