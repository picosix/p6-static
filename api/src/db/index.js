const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTSTRING).catch(error => {
  console.log(error);
  process.exit(error.code);
});

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    mimetype: { type: String, require: true },
    path: { type: String, require: true },
    size: { type: Number }
  },
  { timestamps: true }
);

mongoose.model("Image", ImageSchema);

module.exports = mongoose;
