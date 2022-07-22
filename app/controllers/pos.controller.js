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
      date: req.body.date,
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
      date: req.body.date,
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
    let q = data.findIndex((qbj => qbj.code == '2-4001'));
    let oo = data[o]._id;
    let pp = data[p]._id;
    let qq = data[q]._id;
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
      prefixes+ids[0].journal_id.toString();
      const ent1 = ({journal_id: journid, label: req.order_id,
        debit_acc: pp, debit: req.amount_total, date: req.date})
      Id.findOneAndUpdate({_id: journalid}, {journal_id: journalcount+2}, {useFindAndModify: false})
        .then(datae => {
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: "Income + "+req.order_id,
            credit_acc: oo, credit: req.amount_untaxed, date: req.date})
          Entry.create(ent2).then(datab => {
            const ent3 = ({journal_id: journid , label: "Tax",
              credit_acc: qq, credit: req.amount_tax, date: req.date})
            Entry.create(ent3).then(datac => {
              if(req.amount_tax>0){
                const journal = ({journal_id: journid, origin: req.order_id, amount: req.amount_total,
                  entries:[dataa._id, datab._id, datac._id], date: req.date})
                Journal.create(journal).then(datad => {
                  o=null;p=null;q=null;oo=null;pp=null;qq=null;
                  res.send(datad);
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }else{
                const journal = ({journal_id: journid, origin: req.order_id, amount: req.amount_total,
                  entries:[dataa._id, datab._id], date: req.date})
                Journal.create(journal).then(datad => {
                  o=null;p=null;q=null;oo=null;pp=null;qq=null;
                  res.send(datad);
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
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
    }).catch(err =>{res.status(500).send({message:err.message}); });
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
    }).catch(err =>{res.status(500).send({message:err.message}); });
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

  Pos.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Pos.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{res.status(500).send({message:err.message}); });
};