module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      pos_id: Number,
      pos_session: Number,
      transfer_id: Number,
      pay_id: Number,
      journal_id: Number,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Id = mongoose.model("ids", schema);
  return Id;
};