const express = require("express");
const auth=require('../middlewares/auth')
const tiendaController = require("../controllers/tienda");


const router = express.Router();

router.get("/",auth.checkSession,tiendaController.renderHome);
router.get("/flow/:idproducto",auth.checkSession,tiendaController.ficha);
router.get("/carrito",auth.checkSession,tiendaController.renderCarrito);
router.get("/ordenes",auth.checkSession,tiendaController.renderOrdenes);
router.get("/gracias",auth.checkSession,tiendaController.renderGracias)
router.get("/perfil",auth.checkSession,tiendaController.renderPerfil)
router.get("/chat",auth.checkSession,tiendaController.renderChat)
router.get("/config",auth.checkSession,tiendaController.renderConfig)
router.get("/admin",auth.checkSession,auth.checkAdmin,tiendaController.renderAdmin)
router.get("/admin/producto",auth.checkSession,auth.checkAdmin,tiendaController.renderAdminProducto)
router.get("/admin/producto/:id",auth.checkSession,auth.checkAdmin,tiendaController.renderAdminProducto)

module.exports = router;
