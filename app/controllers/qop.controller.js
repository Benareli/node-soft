const db = require("../models");
const Qop = db.qops;
const Product = db.products;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {

  // Create
  const qop = new Qop({
    product: mongoose.Types.ObjectId(req.body.product),
    partner: mongoose.Types.ObjectId(req.body.partner),
    warehouse: mongoose.Types.ObjectId(req.body.warehouse),
    cost: req.body.cost,
    qop: req.body.qop,
    uom: req.body.uom
  });

  // Save in the database
  qop
    .save(qop)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
};

// Create and Update Product new
exports.createUpdate = (req, res) => {

  // Find first
  if(req.body.partner != "null"){
    Qop.find({product: req.body.product, partner: req.body.partner, warehouse: req.body.warehouse})
      .then(data => {
        if(!data.length){
          const qopp = ({product: req.body.product, partner: req.body.partner, warehouse: req.body.warehouse, 
            cost: req.body.cost, qop: req.body.qop, uom: req.body.uom});
          Qop.create(qopp).then(dataa => {
            var qopid = dataa._id;
            const prod1 = Product.findOneAndUpdate({_id:req.body.product}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                const prod2 = Product.find({_id:req.body.product})
                  .then(datac => {
                    var x = datac[0].qoh + req.body.qop;
                    var y = ((datac[0].qoh * datac[0].cost) + (req.body.qop * req.body.cost)) / x
                    const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                      .then(datad => {
                        res.send(datad);
                      }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }else{
          Qop.find({_id: data[0]._id}).then(datax =>{
            if(req.body.qop>0){
            var x = ((datax[0].qop * datax[0].cost) + (req.body.qop * req.body.cost))
            / (datax[0].qop + req.body.qop);}
            else{var x=datax[0].cost}
            Qop.updateOne({_id:data[0]._id},{qop: data[0].qop+req.body.qop, cost:x})
            .then(dataa => {
              const prod1 = Product.find({_id:req.body.product})
                .then(datab => {
                  var x = datab[0].qoh + req.body.qop;
                  var y = ((datab[0].qoh * datab[0].cost) + (req.body.qop * req.body.cost)) / x
                  const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          });
        }
        
      })
      .catch(err => {
        res.status(500).send({
        message:err.message
        });
      });
  }else{
    Qop.find({product: req.body.product, partner: { $exists : false }, warehouse: req.body.warehouse})
      .then(data => {
        if(!data.length){
          const qopp = ({product: req.body.product, warehouse: req.body.warehouse, 
            cost: req.body.cost, qop: req.body.qop, uom: req.body.uom});
          Qop.create(qopp).then(dataa => {
            var qopid = dataa._id;
            const prod1 = Product.findOneAndUpdate({_id:req.body.product}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                const prod2 = Product.find({_id:req.body.product})
                  .then(datac => {
                    var x = datac[0].qoh + req.body.qop;
                    var y = ((datac[0].qoh * datac[0].cost) + (req.body.qop * req.body.cost)) / x
                    const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                      .then(datad => {
                        res.send(datad);
                      }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }else{
          Qop.find({_id: data[0]._id}).then(datax =>{
            if(req.body.qop>0){
            var x = ((datax[0].qop * datax[0].cost) + (req.body.qop * req.body.cost))
            / (datax[0].qop + req.body.qop);}
            else{var x=datax[0].cost}
            Qop.updateOne({_id:data[0]._id},{qop: data[0].qop+req.body.qop, cost:x})
            .then(dataa => {
              const prod1 = Product.find({_id:req.body.product})
                .then(datab => {
                  var x = datab[0].qoh + req.body.qop;
                  var y = ((datab[0].qoh * datab[0].cost) + (req.body.qop * req.body.cost)) / x
                  const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          })
        }
        
      })
      .catch(err => {
        res.status(500).send({
        message:err.message
        });
      });
  }
};


// Retrieve all from the database.
exports.findAll = (req, res) => {
  /*const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  var o_id = mongoose.Types.ObjectId(req.query.product);*/

  Qop.find({product: req.query.product})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
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

  Qop.findById(id)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
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
exports.findByProduct = (req, res) => {
  Qop.find({product: req.params.product,warehouse: req.params.warehouse})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
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

  Qop.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
