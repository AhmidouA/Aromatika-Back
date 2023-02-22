const express = require("express");
const { oilController } = require("../controller");

const router = express.Router();

router.get("/oil", oilController.index);

module.exports = router;
