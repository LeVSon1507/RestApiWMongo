
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaderSchema = new Schema(
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
      default:""
    },
    designation: {
      type: String,
    },
    abbr: {
        type: String,
      },
    featured: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    // Add two properties of type Date to this schema 
    // createdAt: a date representing when this document was created
    // updatedAt: a date representing when this document was last updated
  }
);
const Leader = mongoose.model("Leaders", leaderSchema);

module.exports = Leader;
