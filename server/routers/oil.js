const express = require("express");
const { oilController } = require("../controller");

const router = express.Router();

router.get("/essential/:id ", oilController.index);

module.exports = router;
