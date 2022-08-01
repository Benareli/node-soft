const db = require("../models");
const { compare } = require('../function/key.function');
const Id = db.ids;
const mongoose = require("mongoose");

// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Id.find(req.query.pos_id)
    .then(data => {
      res.send(data);
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Retrieve POSID.
exports.findPOSessId = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Id.find()
    .then(ids => {
      if(ids[0].pos_session < 10) prefixes = '00000';
      else if(ids[0].pos_session < 100) prefixes = '0000';
      else if(ids[0].pos_session < 1000) prefixes = '000';
      else if(ids[0].pos_session < 10000) prefixes = '00';
      else if(ids[0].pos_session < 100000) prefixes = '0';
      posid = ids[0].pre_pos_session+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pos_session.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pos_session: Number(ids[0].pos_session) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: posid});
          //console.log(data, posid);
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Retrieve POSID.
exports.findPOSId = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Id.find()
    .then(ids => {
      if(ids[0].pos_id < 10) prefixes = '00000';
      else if(ids[0].pos_id < 100) prefixes = '0000';
      else if(ids[0].pos_id < 1000) prefixes = '000';
      else if(ids[0].pos_id < 10000) prefixes = '00';
      else if(ids[0].pos_id < 100000) prefixes = '0';
      posid = ids[0].pre_pos_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pos_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pos_id: Number(ids[0].pos_id) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: posid});
          //console.log(data, posid);
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  }
};

// Retrieve PaymentID.
exports.findPaymentId = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Id.find()
    .then(ids => {
      if(ids[0].pay_id < 10) prefixes = '00000';
      else if(ids[0].pay_id < 100) prefixes = '0000';
      else if(ids[0].pay_id < 1000) prefixes = '000';
      else if(ids[0].pay_id < 10000) prefixes = '00';
      else if(ids[0].pay_id < 100000) prefixes = '0';
      payid = ids[0].pre_pay_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pay_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pay_id: Number(ids[0].pay_id) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: payid});
          //console.log(data, posid);
        }).catch(err =>{res.status(500).send({message:err.message}); });
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

  Id.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {res.send({ message: "Updated successfully."});
       
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
  }
};

/*exports.journalId = 
  Id.find()
    .then(ids => {
      if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = ids[0].pre_journal_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].journal_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {journal_id: Number(ids[0].journal_id) + 1}, {useFindAndModify: false})
        .then(data => {
          return journid;
          //console.log(data, posid);
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
*/