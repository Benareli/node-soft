module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      journal_id: String,
      entries:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"}
      ],
      amount: Number,
      date: String
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Journal = mongoose.model("journals", schema);
  return Journal;
};