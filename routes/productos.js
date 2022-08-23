const express = require("express");
const auth=require('../middlewares/auth')
const productosController = require("../controllers/productos");

const router = express.Router();

router.get("/", auth.checkSession,productosController.getProductos);
router.get("/:id",auth.checkSession,auth.checkAdmin, productosController.getOneProducto);
router.post("/registra", auth.checkSession,auth.checkAdmin,productosController.saveProductos);
router.post("/actualiza/:id",auth.checkSession,auth.checkAdmin, productosController.updateProductos);
router.delete("/:id", auth.checkSession,auth.checkAdmin,productosController.deleteProductos);

module.exports = router;
