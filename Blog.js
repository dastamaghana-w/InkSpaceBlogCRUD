const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  },
);

// const blogSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     author: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       default: "General",
//       trim: true,
//     },
//   },
//   { timestamps: true },
// );

module.exports = mongoose.model("Blog", blogSchema);

module.exports = mongoose.model("Blog", blogSchema);
