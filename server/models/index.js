const userModel = require("./user");
const categoryModel = require("./category");
const oilModel = require("./oil");
const familyModel = require("./family");

module.exports = {
  userModel, // dataMapper (models) User
  categoryModel, // dataMapper (models) Category
  oilModel, // dataMapper (models) Oil
  familyModel // dataMapper (models) Family
};
