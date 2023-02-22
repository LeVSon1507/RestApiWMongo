
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
  {
    rating: {
      type: String,
      min:1,
      max:5,
      required: true,
      unique: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author:{
      type: String,
      required:true,
    }
  },
  {
    timestamps: true,
    // Add two properties of type Date to this schema 
    // createdAt: a date representing when this document was created
    // updatedAt: a date representing when this document was last updated
  }
);
const dishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: [String],
    },
    label: {
      type: String,
    },
    price: {
      type: Currency,
      require:true,
      min:0,
    },
    description: {
      type: String,
    },
    featured: {
      type: Boolean,
    },
    description: {
      type: String,
      required: true,
    },
    comments:[commentSchema]
  },
  {
    timestamps: true,
    // Add two properties of type Date to this schema 
    // createdAt: a date representing when this document was created
    // updatedAt: a date representing when this document was last updated
  }
);
var Dishes = mongoose.model("Dish", dishSchema);
module.exports = Dishes;
