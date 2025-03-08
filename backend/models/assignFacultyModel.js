const mongoose = require("mongoose");

const assignFacultyModel = new mongoose.Schema({
  semester: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    require: true,
  },
  regulation: {
    type: String,
    require: true,
  },
  assigned: {
    type: Object,
    require: true,
  },
});

module.exports = mongoose.model("assignFaclty", assignFacultyModel);
