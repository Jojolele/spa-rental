const mongoose = require("mongoose");

const apartmentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bedroomCount: {
    type: String,
    required: true,
  },
  bathroomCount: {
    type: String,
    required: true,
  },
  kitchenCount: {
    type: String,
    required: true,
  },
  garageCount: {
    type: String,
    required: false,
  },
  imagePath: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Apartment", apartmentSchema);
