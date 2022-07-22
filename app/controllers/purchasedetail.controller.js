const db = require("../models");
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

// Create and Save new
exports.create = (req, res) => {
  // Validate request
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
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};

  Purchasedetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Purchasedetail.findById(id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByPOId = (req, res) => {
  Purchasedetail.find({purchase_id: req.params.po})
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }

  const id = req.params.id;

  Purchasedetail.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

// Update Receive
exports.updateReceiveAll = (req, res) => {
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  x = 0;
  //console.log(req.body);
  startProcess(req, res);
};

function startProcess(req, res){
  if(req.body[x] && req.body[x].qty_rec > 0){
  qin = req.body[x].qty_rec;
  Purchasedetail.findById(req.body[x].id)
    .then(dataa => {
      Id.find().then(ids => {
        transferid = ids[0]._id;
        transfercount = ids[0].transfer_id;
        if(ids[0].transfer_id < 10) prefixes = '00000';
        else if(ids[0].transfer_id < 100) prefixes = '0000';
        else if(ids[0].transfer_id < 1000) prefixes = '000';
        else if(ids[0].transfer_id < 10000) prefixes = '00';
        else if(ids[0].transfer_id < 100000) prefixes = '0';
        transid = "TRANS"+new Date().getFullYear().toString().substr(-2)+
        '0'+(new Date().getMonth() + 1).toString().slice(-2)+
        prefixes+ids[0].transfer_id.toString();
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
  Coa.find().then(data => {
    let o = data.findIndex((obj => obj.code == '2-3001'));
    let p = data.findIndex((pbj => pbj.code == '1-3001'));
    let oo = data[o]._id;
    let pp = data[p]._id;
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
              Id.findOneAndUpdate({_id: journalid}, {journal_id: journalcount+1}, {useFindAndModify: false})
                .then(datae => {
                  sequencing(req, res);
            }).catch(err =>{res.status(500).send({message:err.message}); });
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
  const id = req.params.id;

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
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  Purchasedetail.deleteMany({})
    .then(data => {
      res.send({message: `${data.deletedCount} Data were deleted successfully!`});
    }).catch(err =>{res.status(500).send({message:err.message}); });
};