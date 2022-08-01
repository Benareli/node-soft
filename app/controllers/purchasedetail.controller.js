const db = require("../models");
const {id,coa} = require("../function");
const { compare } = require('../function/key.function');
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Qop = db.qops;
const Id = db.ids;
const Uom = db.uoms;
const Product = db.products;
const Qof = db.qofs;
const Stockmove = db.stockmoves;
const Coa = db.coas;
const Entry = db.entrys;
const Journal = db.journals;
const mongoose = require("mongoose");
var transid;
var transferid;
var trasnfercount;
var journid;
var journalid;
var journalcount;
var y1;
var x;
var qin;

async function getTransId() {
  const res1 = await id.getTransId();
  return res1;
}

async function getUpdateJournalId() {
  const res2 = await id.getUpdateJournalId();
  return res2;
}

async function getCoa2(coa1, coa2) {
  const res3 = await coa.getCoa2(coa1, coa2);
  return res3;
}

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body.purchase_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const purchasedet = ({
    purchase_id: req.body.purchase_id,
    qty: req.body.qty,
    qty_done: req.body.qty_done,
    uom: req.body.uom,
    price_unit: req.body.price_unit,
    discount: req.body.discount,
    tax: req.body.tax,
    subtotal: req.body.subtotal,
    product: req.body.product,
    warehouse: req.body.warehouse,
    date: req.body.date
  });
  Purchasedetail.create(purchasedet).then(dataa => { 
    Purchase.findOneAndUpdate({purchase_id:req.body.purchase_id}, {$push: {purchase_detail: dataa._id}}, { useFindAndModify: false })
      .then(datab => {
          res.send(datab);
      });
  });
}
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Purchasedetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Purchasedetail.findById(req.params.id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByPOId = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Purchasedetail.find({purchase_id: req.params.po})
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
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
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Purchasedetail.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Update Receive
exports.updateReceiveAll = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  x = 0;
  //console.log(req.body);
  startProcess(req, res);
}
};

function startProcess(req, res){
  if(req.body[x] && req.body[x].qty_rec > 0){
  qin = req.body[x].qty_rec;
  Purchasedetail.findById(req.body[x].id)
    .then(dataa => {
      getTransId().then(tids => {
        transid = tids[0];
        transferid = tids[1];
        transfercount = tids[2];
        const stockmove = ({
          trans_id: transid,
          user: req.params.id,
          product: req.body[x].product._id,
          warehouse: req.params.wh,
          origin: dataa.purchase_id,
          qin: qin,
          uom: req.body[x].uom._id,
          date: req.params.date,
        });
        Stockmove.create(stockmove).then(datad => {
          Purchasedetail.findOneAndUpdate({_id: req.body[x].id}, {qty_done: req.body[x].qty_done + qin}, {useFindAndModify: false})
            .then(dataf => {
              Purchasedetail.findOneAndUpdate({_id: req.body[x].id}, {$push: {stockmove: datad._id}}, {useFindAndModify: false})
                .then(datag => {
                  insertQop(req, res);  
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
  }else {
    if(req.body[x]) sequencing(req, res);
    else {
      Id.findOneAndUpdate({_id: transferid}, {transfer_id: transfercount+1}, {useFindAndModify: false})
        .then(datae => {
          res.send({message: "DONE!"});
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }
  }
}

function insertQop(req, res){
  Qop.find({product: req.body[x].product._id, partner: req.params.partner, warehouse: req.params.wh})
    .then(data => {
      if(!data.length){
        const qopp = ({product: req.body[x].product._id, partner: req.params.partner, warehouse: req.params.wh, 
          cost: (req.body[x].subtotal / qin), qop: qin, uom: req.body[x].uom._id});
        Qop.create(qopp).then(dataa => {
          var qopid = dataa._id;
          const prod1 = Product.findOneAndUpdate({_id:req.body[x].product._id}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
            .then(datab => {
              const prod2 = Product.find({_id:req.body[x].product._id})
                .then(datac => {
                  var x1 = datac[0].qoh + qin;
                  y1 = (((datac[0].qoh * datac[0].cost) + 
                      (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin)) / x1).toFixed(2);
                  const prod3 = Product.updateOne({_id:req.body[x].product._id},{qoh:x1,cost:y1})
                    .then(datad => {
                      insertAcc(req, res);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }else{
        Qop.find({_id: data[0]._id}).then(datax =>{
          if(qin>0){
            var x2 = ((datax[0].qop * datax[0].cost) + (Number(req.body[x].subtotal) / qin))
              / (datax[0].qop + qin);
          }else{var x2 = datax[0].cost}
          Qop.updateOne({_id:data[0]._id},{qop: data[0].qop+qin, cost:x2})
          .then(dataa => {
            const prod1 = Product.find({_id:req.body[x].product._id})
              .then(datab => {
                var x1 = datab[0].qoh + qin;
                y1 = (((datab[0].qoh * datab[0].cost) + 
                  (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin)) / x1).toFixed(2);
                const prod3 = Product.updateOne({_id:req.body[x].product._id},{qoh:x1,cost:y1})
                  .then(datac => {
                    insertAcc(req, res);
                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }      
        }).catch(err =>{res.status(500).send({message:err.message}); });
}

function insertAcc(req, res) {
  getCoa2('2-3001', '1-3001').then(coa2 => {
    let oo = coa2[0];
    let pp = coa2[1];
    getUpdateJournalId().then(jids => {
      journid = jids
      const ent1 = ({journal_id: journid, label: req.body[x].product.name,
        debit_acc: pp, debit: (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin), 
        date: req.params.date})
      Entry.create(ent1).then(dataa => {
        const ent2 = ({journal_id: journid, label: req.body[x].product.name,
          credit_acc: oo, credit: (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin), 
          date: req.params.date})
        Entry.create(ent2).then(datab => {
          const journal = ({journal_id: journid, origin: transid, amount: 
            (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin),
            entries:[dataa._id, datab._id], date: req.params.date})
          Journal.create(journal).then(datad => {
              o=null,p=null,oo=null,pp=null;
              sequencing(req, res);
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }).catch(err =>{res.status(500).send({message:err.message}); });
}

function sequencing(req, res){
  x=x+1;
  startProcess(req, res);
}

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Purchasedetail.findById(req.params.id)
    .then(data => {
      Purchase.findOneAndUpdate({purchase_id: data.purchase_id}, {$pull: {purchase_detail: data._id}}, { useFindAndModify: false })
        .then(dataa => {
          Purchasedetail.findByIdAndRemove(req.params.id, { useFindAndModify: false })
            .then(datab => {
              res.send(datab);
            }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Purchasedetail.deleteMany({})
    .then(data => {
      res.send({message: `${data.deletedCount} Data were deleted successfully!`});
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};