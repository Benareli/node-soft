module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      purchase_id: String,
      date: String,
      disc_type: String,
      discount: Number,
      amount_untaxed: Number,
      amount_tax: Number,
      amount_total: Number,
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      purchase_detail:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Purchasedetail"}
      ],
      payment:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"}
      ],
      paid: Boolean,
      open: Boolean,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Purchase = mongoose.model("purchases", schema);
  return Purchase;
};