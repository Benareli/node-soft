module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      purchase_id: String,
      qty: Number,
      qty_done: Number,
      price_unit: Number,
      discount: Number,
      tax: Number,
      subtotal: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      stockmove: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stockmove"
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Purchasedetail = mongoose.model("purchasedetail", schema);
  return Purchasedetail;
};