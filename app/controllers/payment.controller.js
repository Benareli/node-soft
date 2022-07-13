const db = require("../models");
const Pos = db.poss;
const Possession = db.possessions;
const Payment = db.payments;
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
  if(req.body.payment2!="null"){
    const posdetail = ({
      pay_id: req.body.pay_id,
      order_id: req.body.order_id,
      amount_total: req.body.amount_total,
      payment1: req.body.payment1,
      pay1method: req.body.pay1method,
      pay1note: req.body.pay1note,
      payment2: req.body.payment2,
      pay2method: req.body.pay2method,
      pay2note: req.body.pay2note,
      change: req.body.change,
      changeMethod: req.body.changeMethod
    });
    Payment.create(posdetail).then(dataa => { 
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {payment: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(dataa);
              });
          });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }else if(req.body.payment2=="null"){
    const posdetail = ({
      pay_id: req.body.pay_id,
      order_id: req.body.order_id,
      amount_total: req.body.amount_total,
      payment1: req.body.payment1,
      pay1method: req.body.pay1method,
      pay1note: req.body.pay1note,
      change: req.body.change,
      changeMethod: req.body.changeMethod
    });
    Payment.create(posdetail).then(dataa => { 
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {payment: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(dataa);
              });
          });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }
};

function insertAcc(req, res) {
  Coa.find().then(data => {
    let o = data.findIndex((obj => obj.code == '1-2001'));
    let k = data.findIndex((kbj => kbj.code == '1-1001'));
    let b = data.findIndex((bbj => bbj.code == '1-1101'));
    let c = data.findIndex((cbj => cbj.code == '1-1111'));
    let oo = data[o]._id;
    var pp;
    if(req.pay1method=="tunai") pp = data[k]._id;
    else if(req.pay1method=="bank") pp = data[b]._id;
    else if(req.pay1method=="cc") pp = data[c]._id;
    const ent1 = ({journal_id: req.pay_id, label: req.pay1method,
      debit_acc: pp, debit: req.amount_total})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: req.pay_id, label: req.order_id ,
        credit_acc: oo, credit: req.amount_total})
      Entry.create(ent2).then(datab => {
        const journal = ({journal_id: req.pay_id, amount: req.payemnt1,
            entries:[dataa._id, datab._id]})
          Journal.create(journal).then(datac => {
            if(req.payment2>0){
              secondAcc(req,res,o,k,b,c);
            }else if(req.change>0){
              changeAcc(req,res,o,k,b,c);
            }else{
              o=null;k=null;b=null;c=null;oo=null;pp=null;
              res.send(datac);
            }
        });
      })
    })
  })
}

function secondAcc(req, res,o,k,b,c) {
  Coa.find().then(data => {
    let oo = data[o]._id;
    var pp;
    if(req.pay2method=="tunai") pp = data[k]._id;
    else if(req.pay2method=="bank") pp = data[b]._id;
    else if(req.pay2method=="cc") pp = data[c]._id;
    const ent1 = ({journal_id: req.pay_id, label: req.pay2method,
      debit_acc: pp, debit: req.payment2})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: req.pay_id, label: req.order_id ,
        credit_acc: oo, credit: req.payment2})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id:req.pay_id}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            if(req.change>0){
              changeAcc(req,res,o,k,b,c);
            }else{
              o=null;k=null;b=null;c=null;oo=null;pp=null;
              res.send(datac);
            }
        });
      })
    })
  })
}

function changeAcc(req, res,o,k,b,c) {
  Coa.find().then(data => {
    let oo = data[o]._id;
    var pp;
    pp = data[k]._id;
    const ent1 = ({journal_id: req.pay_id, label: "Change",
      debit_acc: oo, debit: req.change})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: req.pay_id, label: req.order_id ,
        credit_acc: pp, credit: req.change})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id:req.pay_id}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            o=null;k=null;b=null;c=null;oo=null;pp=null;
            res.send(datac);
        });
      })
    })
  })
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Payment.find(condition)
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

  Payment.findById(id)
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

  Payment.find(condition)
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

  Payment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  Payment.findByIdAndRemove(id, { useFindAndModify: false })
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
  Payment.deleteMany({})
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