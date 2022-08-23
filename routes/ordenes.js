const express = require("express");
const auth=require('../middlewares/auth');
const ordenesController = require("../controllers/ordenes");

const router = express.Router();

router.get("/mias", auth.checkSession,ordenesController.getOrdenes);


module.exports = router;
