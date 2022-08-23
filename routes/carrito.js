const express = require("express");
const auth=require('../middlewares/auth');
const carritoController = require("../controllers/carrito");


const router = express.Router();

router.get("/items",auth.checkSession,carritoController.itemsCarrito);
router.get("/productos",auth.checkSession,carritoController.ObtenerProductosCarrito);
router.post("/",auth.checkSession,carritoController.AgregarProductos);
router.post("/vaciar",auth.checkSession,carritoController.Vaciar);
router.put("/actualizar",auth.checkSession,carritoController.Actualizar);
router.post("/confirmar",auth.checkSession,carritoController.Confirmar);
router.delete("/quitarProducto/:idproducto",auth.checkSession,carritoController.QuitarProducto)

//router.get("/carrito",auth.checkSession,tc.Carrito);
/*router.get("/gracias",auth.checkSession,(req,res)=>{
	res.render('pages/gracias');
})*/
/*
router.get("/", productosController.getProductos);
router.get("/:id", productosController.getOneProducto);
router.post("/", productosController.saveProductos);
router.put("/:id", productosController.updateProductos);
router.delete("/:id", productosController.deleteProductos);
*/
module.exports = router;
