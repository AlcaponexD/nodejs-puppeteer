const express = require("express");
const router = express.Router();

const terabyte = require("../services/crawlers/terabyte");
const pichau = require("../services/crawlers/pichau");
const kabum = require("../services/crawlers/kabum");

//Jeito certo
router.get("/terabyte",terabyte.gpu)

router.get("/pichau",pichau.gpu);

router.get("/kabum",kabum.gpu);

//Exports rout
module.exports = router;
