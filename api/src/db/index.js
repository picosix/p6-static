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
    width: Number,
    height: Number,
    fileSize: Number
  },
  { timestamps: true }
);

const CacheSchema = new mongoose.Schema(
  {
    imageId: { type: mongoose.Schema.Types.ObjectId, require: true },
    mimetype: { type: String, require: true },
    path: { type: String, require: true },
    type: String,
    size: String,
    width: Number,
    height: Number,
    fileSize: Number
  },
  { timestamps: true }
);

const StatictisSchema = new mongoose.Schema(
  {
    images: Number,
    cache: Number,
    storage: {
      total: String,
      used: String,
      available: String,
      usedPercent: Number,
      availablePercent: Number
    }
  },
  { timestamps: true }
);

mongoose.model("Image", ImageSchema);
mongoose.model("Cache", CacheSchema);
mongoose.model("Statictis", StatictisSchema);

module.exports = mongoose;
