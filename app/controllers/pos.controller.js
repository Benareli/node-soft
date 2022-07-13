const db = require("../models");
const Pos = db.poss;
const Posdetail = db.posdetails;
const Possession = db.possessions;
const Brand = db.brands;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.partner != "null"){
    const pos = ({
      order_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      partner: req.body.partner,
      user: req.body.user,
      open: req.body.open,
      payment: [req.body.payment]
    });
    Pos.create(pos).then(dataa => { 
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {pos: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(datab);
              });
          });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }
  else if(req.body.partner == "null"){
    const pos = ({
      order_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      user: req.body.user,
      open: req.body.open,
      payment: [req.body.payment]
    });
    Pos.create(pos).then(dataa => {
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {pos: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(datab);
              }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }
};

function insertAcc(req, res) {
  Coa.find().then(data => {
    let o = data.findIndex((obj => obj.code == '4-1001'));
    let p = data.findIndex((pbj => pbj.code == '1-2001'));
    let q = data.findIndex((qbj => qbj.code == '2-3001'));
    let oo = data[o]._id;
    let pp = data[p]._id;
    let qq = data[q]._id;
    const ent1 = ({journal_id: req.trans_id, label: req.order_id,
      debit_acc: pp, debit: req.amount_total})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: req.trans_id, label: "Income + "+req.order_id,
        credit_acc: oo, credit: req.amount_untaxed})
      Entry.create(ent2).then(datab => {
        const ent3 = ({journal_id: req.trans_id, label: "Tax",
          credit_acc: qq, credit: req.amount_tax})
        Entry.create(ent3).then(datac => {
          if(req.amount_tax>0){
            const journal = ({journal_id: req.order_id, amount: req.amount_total,
              entries:[dataa._id, datab._id, datac._id]})
            Journal.create(journal).then(datad => {
              o=null;p=null;q=null;oo=null;pp=null;qq=null;
              res.send(datad);
            })
          }else{
            const journal = ({journal_id: req.order_id, amount: req.amount_total,
              entries:[dataa._id, datab._id]})
            Journal.create(journal).then(datad => {
              o=null;p=null;q=null;oo=null;pp=null;qq=null;
              res.send(datad);
            })
          }
        })
      })
    })
  })
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Pos.find(condition)
    .populate({ path: 'partner', model: Partner })
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

  Pos.findById(id)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'user', model: User })
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
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Pos.find(condition)
    .populate({ path: 'partner', model: Partner })
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

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Pos.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
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

  Pos.findByIdAndRemove(id, { useFindAndModify: false })
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
  Pos.deleteMany({})
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