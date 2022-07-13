module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      order_id: String,
      qty: Number,
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      price_unit: Number,
      discount: Number,
      tax: Number,
      subtotal: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Posdetail = mongoose.model("posdetails", schema);
  return Posdetail;
};