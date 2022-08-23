const express = require('express');
const auth=require('../middlewares/auth')
const router = express.Router();
const usuariosController=require("../controllers/usuarios")

const passport=require("passport");



/*router.get("/perfil",auth.checkSession,(req,res)=>{
	res.render('pages/register',{userLogged:req.user});
})*/

//router.get("/errorLogin",usuariosController.ErrorLogin)
router.get("/login",usuariosController.RenderLogin);
router.get("/getUser",usuariosController.RenderLogin);
router.get("/registro",usuariosController.RenderRegistro);
router.post("/login",passport.authenticate("login",{failureRedirect:'/errorLogin'}),async (req,res)=>{
	res.redirect("/")
})
router.get("/errorLogin",usuariosController.ErrorLogin)
router.get("/salir",usuariosController.Salir)

router.post("/registro",usuariosController.Registro)
router.post("/perfil",usuariosController.Actualiza)

module.exports=router;