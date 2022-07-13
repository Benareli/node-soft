function checkQof() {
  const find1 = Qof.find()
    .then(res => {
      if(!res.length){
        if(res[0].partner){
          withQop(res[0].product, res[0].partner);
        }else{
          binyolos(res[0].product);
        }
      }else{console.log("No Data");}
    })
    .catch(error => console.error(error));
}

function withQop(prod1, part1) {
  const find2 = Qop.find({product: prod1, partner: part1}).then(res => {
    if(!res.length){
      var qop1 = {product: prod1, partner: part1, qop: 0};
      Qop.create(qop1).then(res => {
        let qop1 = res._id;
        const prod2 = Product.findOneAndUpdate({_id:prod1}, {$push: {qop: res._id}}, { new: true })
          .then(res => {
            handleCalcQop(qop1, prod1, part1);
          }).catch(error => console.error(error));
      })
      .catch(error => console.error(error));
      

    }else{handleCalcQop(res[0]._id, prod1, part1)}
  }).catch(error => console.error(error));
}

function handleCalcQop(qop2, prod2, part2) {
  const cursor = Qof.find({product:prod2,partner:part2})
    .then(results => {
      let x = 0;
      for (let i = 0; i < results.length; i++){
        x = x + results[i].qof};
        console.log(x);

      const prod = Product.find({_id:prod2})
        .then(resultsP => {
          let y = resultsP[0].qoh
          const upProd = Product.updateOne({_id:prod2},{qoh: x+y})
            .then(resultsUp => {
              handleQop(x, qop2, prod2, part2);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

function handleQop(x, qop3, prod3, part3) {
  console.log(x);
  const findQop = Qop.find({_id:qop3})
    .then(resultsQop1 => {
      let z = resultsQop1[0].qop
      console.log(z);
      const upProd = Qop.updateOne({_id:qop3},{qop: x+z})
        .then(resultsQop2 => {
          const delQof = Qof.deleteMany({product:prod3,partner:part3})
            .then(resultsdelQof => {
              console.log(prod3+", "+part3+" handled");
              checkQof();
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

function binyolos(z) {
  const cursor = Qof.find({product:z})
    .then(results => {
      let x = 0;
      for (let i = 0; i < results.length; i++){
        x = x + results[i].qof};

      const prod = Product.find({_id:z})
        .then(resultsP => {
          let y = resultsP[0].qoh
          const upProd = Product.updateOne({_id:z},{qoh: x+y})
            .then(resultsUp => {
              const delQof = Qof.deleteMany({product:z})
                .then(resultsDel => {checkQof();
            })
            .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}