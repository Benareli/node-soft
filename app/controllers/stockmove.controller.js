const db = require("../models");
const Stockmove = db.stockmoves;
const Journal = db.journals;
const Entry = db.entrys;
const Product = db.products;
const Partner = db.partners;
const Uom = db.uoms;
const Warehouse = db.warehouses;
const User = db.users;
const Coa = db.coas;
const Ids = db.ids;
//const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create
  if(req.body.partner != "null"){
    const stockmove = ({
      trans_id: req.body.trans_id,
      user: req.body.user,
      product: req.body.product,
      partner: req.body.partner,
      warehouse: req.body.warehouse,
      qin: req.body.qin,
      qout: req.body.qout,
      uom: req.body.uom
    });
    /*Old Price * Quantity valued at Old Price) + 
    (Quantity received in last shipment * Price of the product in last shipment)) / 
    (Quantity valued at old price + quantity received in last shipment*/
    
    Stockmove.create(stockmove).then(data => {
        insertAcc(req.body, res);
      }).catch(err => {res.status(500).send({message:err.message});
    });
  }
  if(req.body.partner == "null"){
    const stockmove = ({
      trans_id: req.body.trans_id,
      user: req.body.user,
      product: req.body.product,
      warehouse: req.body.warehouse,
      qin: req.body.qin,
      qout: req.body.qout,
      uom: req.body.uom
    });
    Stockmove.create(stockmove).then(data => {
        insertAcc(req.body, res);
      }).catch(err => {res.status(500).send({message:err.message});
    });
  }
};

function insertAcc(req, res) {
  Product.findById(req.product).then(prod => {
    let prodname = prod.name;
  Coa.find().then(data => {
    if((req.qin && !req.qout) || (req.qin && req.qout == 0)){
      let o = data.findIndex((obj => obj.code == '1-3901'));
      let p = data.findIndex((pbj => pbj.code == '1-3001'));
      let oo = data[o]._id;
      let pp = data[p]._id;
      const ent1 = ({journal_id: req.trans_id, label: prodname,
        debit_acc: oo, debit: req.qin * req.cost})
      Entry.create(ent1).then(dataa => {
        const ent2 = ({journal_id: req.trans_id, label: prodname,
          credit_acc: pp, credit: req.qin * req.cost})
        Entry.create(ent2).then(datab => {
          const journal = ({journal_id: req.trans_id, 
            amount: req.qin * req.cost, entries:[dataa._id, datab._id]})
          Journal.create(journal).then(datac => {
            o=null;p=null;oo=null;pp=null;prodname=null;
            res.send(dataa);
          })
        })
      })
    }else if((req.qout && !req.qin) || (req.qout && req.qin == 0)){
      let o = data.findIndex((obj => obj.code == '1-3901'));
      let p = data.findIndex((pbj => pbj.code == '1-3001'));
      let oo = data[o]._id;
      let pp = data[p]._id;
      const ent1 = ({journal_id: req.trans_id, label: prodname,
        debit_acc: oo, debit: req.qout * req.cost})
      Entry.create(ent1).then(dataa => {
        const ent2 = ({journal_id: req.trans_id, label: prodname,
          credit_acc: pp, credit: req.qout * req.cost})
        Entry.create(ent2).then(datab => {
          const journal = ({journal_id: req.trans_id, 
            amount: req.qout * req.cost, entries:[dataa._id, datab._id]})
          Journal.create(journal).then(datac => {
            o=null;p=null;oo=null;pp=null;prodname=null;
            res.send(dataa);
          })
        })
      })
    }
  })
  })
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};

  Stockmove.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
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

  Stockmove.findById(id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
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
exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};

  Stockmove.find({product: req.query.product})
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