const db = require("../models");
const Id = db.ids;
//const mongoose = require("mongoose");

function getJournalId() {
  return new Promise(resolve => {
    Id.find().then(ids => {
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
          //console.log(journid);
          resolve (journid);
          //return journid;
          //console.log(data, posid);
        }).catch(err =>{res.status(500).send({message:err.message}); });
    }).catch(err =>{res.status(500).send({message:err.message}); });
  })
};

const id = {
  getJournalId,
};
module.exports = id;