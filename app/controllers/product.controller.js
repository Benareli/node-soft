const db = require("../models");
const { compare } = require('../function/key.function');
const Product = db.products;
const ProductCat = db.productcats;
const Brand = db.brands;
const Partner = db.partners;
const Uom = db.uoms;
const Log = db.logs;
const User = db.users;
const Tax = db.taxs;
const mongoose = require("mongoose");
const duplicate = [];
const skipped = [];
var Pcateg = '';
var Pbrand = '';
var Ptaxin = '';
var Ptaxout = '';
var Psuom = 'Pcs';
var Ppuom = 'Pcs';

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  if(req.body.taxin==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      fg: req.body.fg ? req.body.fg : false,
      rm: req.body.rm ? req.body.rm : false,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      cost: req.body.cost ? cost: 0,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxout: req.body.taxout,
      brand: req.body.brand,
      min: req.body.min,
      max: req.body.max,
      supplier: req.body.supplier,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else if(req.body.taxout==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      fg: req.body.fg ? req.body.fg : false,
      rm: req.body.rm ? req.body.rm : false,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      suom: req.body.suom,
      puom: req.body.puom,
      cost: req.body.cost ? cost: 0,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxin: req.body.taxin,
      brand: req.body.brand,
      min: req.body.min,
      max: req.body.max,
      supplier: req.body.supplier,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else if(req.body.taxout=="" && req.body.taxin==""){
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      fg: req.body.fg ? req.body.fg : false,
      rm: req.body.rm ? req.body.rm : false,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      suom: req.body.suom,
      puom: req.body.puom,
      cost: req.body.cost ? cost: 0,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      brand: req.body.brand,
      min: req.body.min,
      max: req.body.max,
      supplier: req.body.supplier,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }else{
    const product = ({
      sku: req.body.sku,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      fg: req.body.fg ? req.body.fg : false,
      rm: req.body.rm ? req.body.rm : false,
      listprice: req.body.listprice,
      botprice: req.body.botprice,
      suom: req.body.suom,
      puom: req.body.puom,
      cost: req.body.cost ? cost: 0,
      qoh: req.body.qoh,
      image: req.body.image,
      isStock: req.body.isStock ? req.body.isStock : false,
      category: req.body.category,
      taxin: req.body.taxin,
      taxout: req.body.taxout,
      brand: req.body.brand,
      min: req.body.min,
      max: req.body.max,
      supplier: req.body.supplier,
      active: req.body.active ? req.body.active : false
    });
    Product.create(product).then(dataa => {
      const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(datab);
      }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
}
};


// Create and Save new
exports.createMany = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  duplicate.splice(0,duplicate.length);
  skipped.splice(0,duplicate.length);
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Product.find({name: reqs[x].nama}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        ProductCat.find({description: reqs[x].kategori}).then(dataa => {
          if(dataa.length>0) Pcateg = dataa[0]._id;
          else{ skipped.push(x+1); sequencing(x, reqs, users, res); }
          Brand.find({description: reqs[x].merek}).then(datab => {
            if(datab.length>0) Pbrand = datab[0]._id;
            if(!reqs[x].pajakmasuk) reqs[x].pajakmasuk = '1000';
            Tax.find({tax: Number(reqs[x].pajakmasuk)}).then(datac => {
              if(datac) Ptaxin = datac[0]._id;
              if(!reqs[x].pajakkeluar) reqs[x].pajakkeluar = '1000';
              Tax.find({tax: Number(reqs[x].pajakkeluar)}).then(datad => {
                if(datad) Ptaxout = datad[0]._id;
                Uom.find({uom_name: reqs[x].satuan_jual}).then(datae => {
                  if(datae) Psuom = datae[0]._id;
                  Uom.find({uom_name: reqs[x].satuan_beli}).then(dataf => {
                    if(dataf) Ppuom = dataf[0]._id;
                
                if(reqs[x].tipe=='barang'||reqs[x].tipe=='Barang'||reqs[x].tipe=="BARANG"){
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:true,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,suom:Psuom,puom:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }else{
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:false,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,suom:Psuom,puom:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{res.status(500).send({message:err.message}); });
                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }

                  }).catch(err =>{res.status(500).send({message:err.message}); });
                }).catch(err =>{res.status(500).send({message:err.message}); });
              }).catch(err =>{res.status(500).send({message:err.message}); });
            }).catch(err =>{res.status(500).send({message:err.message}); });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }).catch(err =>{res.status(500).send({message:err.message}); });
        
      }
    });
  }else{
    if(duplicate.length>0||skipped.length>0){res.status(500).send(duplicate, skipped);
      duplicate.splice(0,duplicate.length);skipped.splice(0,skipped.length);
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';}
    else {
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';
      res.status(200).send({message:"Semua data telah diinput!"});
    }
  }
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
  Product.find(condition)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.findById(req.params.id)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
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
  Product.find(condition)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
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
  const id = req.params.id;
  if (req.body.taxin==""){
    Product.findByIdAndUpdate(id, {$unset: {taxin:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        suom: req.body.suom,
        puom: req.body.puom,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        taxout: req.body.taxout,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else if (req.body.taxout==""){
    Product.findByIdAndUpdate(id, {$unset: {taxout:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        suom: req.body.suom,
        puom: req.body.puom,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        taxin: req.body.taxin,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else if (req.body.taxout=="" && req.body.taxin==""){
    Product.findByIdAndUpdate(id, {$unset: {taxout:1,taxin:1}}, { useFindAndModify: false })
    .then(data => {});
    Product.findByIdAndUpdate(id, {
      sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        listprice: req.body.listprice,
        botprice: req.body.botprice,
        suom: req.body.suom,
        puom: req.body.puom,
        cost: req.body.cost,
        image: req.body.image,
        isStock: req.body.isStock ? req.body.isStock : false,
        category: req.body.category,
        brand: req.body.brand,
        active: req.body.active ? req.body.active : false
        },{ useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
          });
        } else {
          const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
          Log.create(log).then(datab => {
            res.send({ message: "Updated successfully." });
          }).catch(err =>{res.status(500).send({message:err.message}); });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating with id=" + id
        });
    });
  }else{

    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
}
};

// Find all active
exports.findAllActive = (req, res) => {
  //, sort=[( "_id", 1)]
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.find({ active: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

//Find all stock
exports.findAllStock = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.find({ isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

//Find all active stock
exports.findAllActiveStock = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.find({ active: true, isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

//Find all fg stock
exports.findAllRMStock = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.find({ fg: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

//Find all PO Ready
exports.findAllPOReady = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Product.find({ fg: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};