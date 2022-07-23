const db = require("../models");
const Pos = db.poss;
const Possession = db.possessions;
const Payment = db.payments;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Id = db.ids;
const mongoose = require("mongoose");
var journid;
var journalid;
var journalcount;

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
      changeMethod: req.body.changeMethod,
      date: req.body.date
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
      changeMethod: req.body.changeMethod,
      date: req.body.date
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
    Id.find().then(ids => {
      journalid = ids[0]._id;
      journalcount = ids[0].journal_id;
      if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = "JUR"+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+(Number(ids[0].journal_id)+1).toString();
        const ent1 = ({journal_id: journid, label: req.pay1method,
          debit_acc: pp, debit: req.payment1, date: req.date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: req.order_id ,
            credit_acc: oo, credit: req.payment1, date: req.date})
          Entry.create(ent2).then(datab => {
            const journal = ({journal_id: journid, origin: req.pay_id, 
              amount: Number(req.payment1) + Number(req.payment2) ? req.payment2: 0 + Number(req.change) ? req.change: 0,
              entries:[dataa._id, datab._id], date: req.date})
              Journal.create(journal).then(datac => {
                console.log("Journal", datac);
                if(req.payment2>0){
                  secondAcc(req,res,o,k,b,c);
                }else if(req.change>0){
                  changeAcc(req,res,o,k,b,c);
                }else{
                  o=null;k=null;b=null;c=null;oo=null;pp=null;
                  res.send(datac);
                }
              }).catch(err => {res.status(500).send({message:err.message}); })
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
}

function secondAcc(req, res,o,k,b,c) {
  Coa.find().then(data => {
    let oo = data[o]._id;
    var pp;
    if(req.pay2method=="tunai") pp = data[k]._id;
    else if(req.pay2method=="bank") pp = data[b]._id;
    else if(req.pay2method=="cc") pp = data[c]._id;
    const ent1 = ({journal_id: journid, label: req.pay2method,
      debit_acc: pp, debit: req.payment2, date: req.date})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: journid, label: req.order_id ,
        credit_acc: oo, credit: req.payment2, date: req.date})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id: journid}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            if(req.change>0){
              changeAcc(req,res,o,k,b,c);
            }else{
              o=null;k=null;b=null;c=null;oo=null;pp=null;
              res.send(datac);
            }
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
}

function changeAcc(req, res,o,k,b,c) {
  Coa.find().then(data => {
    let oo = data[o]._id;
    var pp;
    pp = data[k]._id;
    const ent1 = ({journal_id: journid, label: "Change",
      debit_acc: oo, debit: req.change, date: req.date})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: journid, label: req.order_id ,
        credit_acc: pp, credit: req.change, date: req.date})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id: journid}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            o=null;k=null;b=null;c=null;oo=null;pp=null;
            res.send(datac);
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Payment.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Payment.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};

  Payment.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
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
    }).catch(err =>{res.status(500).send({message:err.message}); });
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
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Payment.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{res.status(500).send({message:err.message}); });
};