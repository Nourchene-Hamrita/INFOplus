import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  eventPictures: [{ type: String }], // Updated property to be an array of strings
  type: {
    type: String,
    enum: ["Free Event", "Paid Event", "Online Event"],
    required: true,
  },
  price: {
    type: Number,
    required: function () {
      return this.type === "Paid Event";
    },
  },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
