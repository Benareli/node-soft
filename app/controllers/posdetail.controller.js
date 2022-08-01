const db = require("../models");
const { compare } = require('../function/key.function');
const {id,coa} = require("../function");
const Pos = db.poss;
const Posdetail = db.posdetails;
const Id = db.ids;
const Stockmove = db.stockmoves;
const Product = db.products;
const Bundle = db.bundles;
const Uom = db.uoms;
const Qop = db.qops;
const Qof = db.qofs;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const mongoose =  require("mongoose");
var costA = 0;
var amountx = 0;
var prefixes = '';
var transid = '';
var journid;
var journalid;
var journalcount;

async function getUpdateTransId() {
  const res1 = await id.getUpdateTransId();
  return res1;
}

async function getCoa2(coa1, coa2) {
  const res2 = await coa.getCoa2(coa1, coa2);
  return res2;
}

// Create and Save new
exports.create = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  // Validate request
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(req.body.fg){
    insertPOSDetail(req.body, res);
  }
  if(req.body.isStock=="true"&&!req.body.fg){
    const posdetail = ({
      order_id: req.body.order_id, qty: req.body.qty, uom: req.body.uom,
      price_unit: req.body.price_unit, tax: req.body.tax, subtotal: req.body.subtotal,
      product: req.body.product, warehouse: req.body.warehouse, date: req.body.date,
      store: req.body.store,
    });
    Posdetail.create(posdetail).then(dataa => {
      //Pos.find(mongoose.Types.ObjectId(req.body.ids))
      Pos.findOneAndUpdate({order_id: req.body.order_id}, {$push: {pos_detail: dataa._id}}, { useFindAndModify: false })
        .then(datab => { 
          if(req.body.partner=="null" || !req.body.partner){
            const qof1 = ({qof: 0-Number(req.body.qty), product: req.body.product, 
              warehouse: req.body.warehouse, uom: req.body.uom});
            Qof.create(qof1).then(datac => {
              getUpdateTransId().then(restransid => {
                transid = restransid;
                const stockmove = ({
                  trans_id: transid,
                  user: req.body.user,
                  product: req.body.product,
                  warehouse: req.body.warehouse,
                  origin: req.body.order_id,
                  qout: req.body.qty,
                  uom: req.body.uom,
                  date: req.body.date,
                });
                Stockmove.create(stockmove).then(datad => {
                  findCost(req.body, res);
                  }).catch(err => {res.status(500).send({message:err.message});
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }else if(req.body.partner!="null"){
            const qof1 = ({qof: 0-Number(req.body.qty), product: req.body.product, 
              partner: req.body.partner, warehouse: req.body.warehouse, uom: req.body.uom});
            Qof.create(qof1).then(datac => {
              getUpdateTransId().then(restransid => {
                transid = restransid;
                const stockmove = ({
                  trans_id: req.body.transid,
                  user: req.body.user,
                  product: req.body.product,
                  partner: req.body.partner,
                  warehouse: req.body.warehouse,
                  origin: req.body.order_id,
                  qout: req.body.qty,
                  uom: req.body.uom,
                  date: req.body.date,
                });
                Stockmove.create(stockmove).then(datad => {
                  findCost(req.body, res);
                  }).catch(err => {res.status(500).send({message:err.message});
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }   
      });
    });
  }else if(req.body.isStock=="false"&&!req.body.fg){
    const posdetail = ({
      order_id: req.body.order_id,
      qty: req.body.qty,
      uom: req.body.uom,
      price_unit: req.body.price_unit,
      tax: req.body.tax,
      subtotal: req.body.subtotal,
      product: req.body.product,
      warehouse: req.body.warehouse,
      date: req.body.date,
      store: req.body.store,
    });
    Posdetail.create(posdetail).then(dataa => { 
      Pos.findOneAndUpdate({order_id: req.body.order_id}, {$push: {pos_detail: dataa._id}}, { useFindAndModify: false })
        .then(datab => { 
          res.send(datab);
        });
    });
  }
}
};

function insertPOSDetail(reqs,res){
  const posdetail2 = ({
    order_id: reqs.order_id, qty: reqs.qty, uom: reqs.uom,
    price_unit: reqs.price_unit, tax: reqs.tax, subtotal: reqs.subtotal,
    product: reqs.product, warehouse: reqs.warehouse, date: reqs.date,
    store: req.body.store,
  });
  Posdetail.create(posdetail2).then(dataz => {
    Pos.findOneAndUpdate({order_id: reqs.order_id}, {$push: {pos_detail: dataz._id}}, { useFindAndModify: false })
      .then(datay => { startSequence(reqs, res);
    }).catch(err => {res.status(500).send({message:err.message}); });
  }).catch(err => {res.status(500).send({message:err.message}); });
}

function startSequence(reqs, res){
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Bundle.find({bundle: reqs.product})
    .then(dat => {
      playSequencing(0, reqs, dat, res);
  }).catch(err => {res.status(500).send({message:err.message}); });
  }
}

function playSequencing(x, reqs, dat, res){
  if(dat[x]){
   if(reqs.partner=="null" || !reqs.partner){
    const qof1 = ({qof: 0-(Number(reqs.qty) * Number(dat[x].qty)), product: dat[x].product, 
      warehouse: reqs.warehouse, uom: reqs.uom});
      Qof.create(qof1).then(datac => {
        getUpdateTransId().then(restransid => {
          transid = restransid;
          const stockmove = ({
            trans_id: transid,
            user: reqs.user,
            product: dat[x].product,
            warehouse: reqs.warehouse,
            origin: reqs.order_id,
            qout: (Number(reqs.qty) * Number(dat[x].qty)),
            uom: reqs.uom,
            date: reqs.date
          });
          Stockmove.create(stockmove).then(datad => {
            findCostBundle(x, reqs, dat, res);
            }).catch(err => {res.status(500).send({message:err.message});
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }else if(reqs.partner!="null"){
      const qof1 = ({qof: 0-(Number(reqs.qty) * Number(dat[x].qty)), product: dat[x].product, 
        partner: reqs.partner, warehouse: reqs.warehouse, uom: reqs.uom});
      Qof.create(qof1).then(datac => {
        /*Id.find().then(ids => {
          if(ids[0].transfer_id < 10) prefixes = '00000';
          else if(ids[0].transfer_id < 100) prefixes = '0000';
          else if(ids[0].transfer_id < 1000) prefixes = '000';
          else if(ids[0].transfer_id < 10000) prefixes = '00';
          else if(ids[0].transfer_id < 100000) prefixes = '0';
          transid = ids[0].pre_transfer_id+'-'+new Date().getFullYear().toString().substr(-2)+
          '0'+(new Date().getMonth() + 1).toString().slice(-2)+
          prefixes+ids[0].transfer_id.toString();*/
        getUpdateTransId().then(restransid => {
          transid = restransid;
          const stockmove = ({
            trans_id: transid,
            user: reqs.user,
            product: dat[x].product,
            partner: reqs.partner,
            warehouse: reqs.warehouse,
            origin: reqs.order_id,
            qout: (Number(reqs.qty) * Number(dat[x].qty)),
            uom: reqs.uom,
            date: reqs.date
          });
          Stockmove.create(stockmove).then(datad => {
            /*Id.findOneAndUpdate({_id: ids}, {transfer_id: ids[0].transfer_id+1}, {useFindAndModify: false})
              .then(datae => {*/
                findCostBundle(x, reqs, dat, res);
              //}).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err => {res.status(500).send({message:err.message});
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }
  }else{
    res.status(200).send({message:"All bundle data in!"});
  }
}

function sequencing(x, reqs, dat, res){
  x=x+1;
  playSequencing(x, reqs, dat, res);
}

function findCostBundle(x, reqs, dat, res){
  Product.findById(dat[x].product).then(data => {
    costA = data.cost;
    let prodname = data.name;
    Journal.findOne({_id: req.ids}).then(ids => {
      var journ_id = ids._id;
      amountx = ids.amount;
      journid = ids.journal_id;
      getCoa2('1-3001', '5-1001').then(coa2 => {
      /*Coa.find().then(datag => {
        let o = datag.findIndex((obj => obj.code == '1-3001'));
        let p = datag.findIndex((pbj => pbj.code == '5-1001'));*/
        let oo = coa2[0];
        let pp = coa2[1];
        const ent1 = ({journal_id: journid, label: prodname,
          debit_acc: pp, debit: costA, date: reqs.date})
        Entry.create(ent1).then(datah => {
          const ent2 = ({journal_id: journid, label: prodname,
            credit_acc: oo, credit: costA, date: reqs.date})
          Entry.create(ent2).then(datai => {
            Journal.findOneAndUpdate({id: journ_id}, 
              {$push: {entries: [datah._id,datai._id]}, amount: amountx + costA}, {useFindAndModify: false})
              .then(dataj => {
                o=null,p=null,oo=null,pp=null;
                sequencing(x, reqs, dat, res);
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
}

function findCost(req, res) {
  if(req.meth){
    Product.findById(req.product).then(datax => {
      costA = datax.cost;
      insertAcc(req, res);
    })
  }else{
    Qop.findById(req.qop).then(datax => {
      costA = datax.cost;
      insertAcc(req, res);
    })
  }
}

function insertAcc(req, res) {
  Product.findById(req.product).then(prod => {
    let prodname = prod.name;
    Journal.findOne({_id: req.ids}).then(ids => {
      var journ_id = ids._id;
      amountx = ids.amount;
      journid = ids.journal_id;
      getCoa2('1-3001', '5-1001').then(coa2 => {
        let oo = coa2[0];
        let pp = coa2[1];
        const ent1 = ({journal_id: journid, label: prodname,
          debit_acc: pp, debit: costA ? debit: 0, date: req.date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: prodname,
            credit_acc: oo, credit: costA ? credit: 0, date: req.date})
          Entry.create(ent2).then(datab => {
            Journal.findOneAndUpdate({_id: journ_id}, 
              {$push: {entries: [dataa._id,datab._id]}, amount: costA + amountx}, {useFindAndModify: false})
              .then(datac => {
                o=null,p=null,oo=null,pp=null;
                res.send(datac);
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
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Posdetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Posdetail.findById(req.params.id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Posdetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
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
  Posdetail.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
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