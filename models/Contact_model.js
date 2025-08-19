const mongoose = require("mongoose");
const { Schema } = mongoose;
const ContactSchema = new mongoose.Schema(
  {
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required:true
        },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
