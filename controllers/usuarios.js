
const path =require('path');
const logger=require("../utils/logger");
const log=new logger();
const usuariosService = require("../services/usuarios");
const uservice = new usuariosService();  
const bcrypt = require('bcrypt');
//const productos=require("../models/productos");
//const iproducto=new productos();

const email=require("../utils/email");
let EnviaMail=new email();

//const carrito=require("../models/carrito");
//const icarrito=new carrito();


    
    const Salir=async(req,res)=>{
        try{
            let nombre=req.user.email;
            req.logout(function(err) {
            
            if (err) { return next(err); }
                req.session.destroy();
                res.render("pages/salir",{usuario:nombre})
            });	
        }catch(error){
            log.error(error);
            res.status(400).json({error});
        }
    
        
    }
    const RenderLogin=async(req,res)=>{
        try{
            res.render('pages/login');
        }catch(error){
            log.error(error);
            res.status(400).json({error});
        }
    }

    const GetUser=async(req,res)=>{
        try{
            let user=req.user;
            res.status(200).json({user})
        }catch(error){
            log.error(error);
            res.status(400).json({error});
        }
    }

    const RenderRegistro=async(req,res)=>{
        try{
            res.render('pages/register');
        }catch(error){
            log.error(error);
            res.status(400).json({error});
        }
    }

    const ErrorLogin = async (req, res) => {
        try {
            res.render('pages/error',{result:'usuario / contraseña incorrectas',url:'login'});
        } catch (error) {
            log.error(error);
            res.status(400).json({error});
        }
    
    }

    const Registro = async (req, res) => {
        try {
            log
            if(!req.files) {
                res.render('pages/error',"Ingrese la imagen de perfil");
            }
            const file = req.files.profileImage;
            const filename=Date.now()+path.extname(file.name);
            const filepath = "./public/uploads/" +filename ;
            file.mv(filepath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                
            });
            let hash=await bcrypt.hash(req.body.contra,10);
            let newUser = {
                nombre: req.body.nombre,
                contra : hash,
                email:  req.body.email,
                direccion: req.body.direccion,
                edad: req.body.edad,
                telefono: req.body.telefono,
                profile:filename
            }
            
            let ret=await uservice.addUsuario(newUser);
            
            if(!ret){
                
                ret.url="registro";
                res.render('pages/error',ret);
            }else{
                await EnviaMail.enviarAdmin("nuevoRegistro",newUser);
                res.redirect("/login")
            }
            //EnviaMail.enviarAdmin("nuevoRegistro",newUser);
            //res.send("ok");
        } catch (error) {
            log.error(error);
            res.status(400).json({error});
        }
    
    }

    const Actualiza = async (req, res) => {
        try {
            let filename=req.user.profile;
            
            if(req.files){
                const file = req.files.profileImage;
                filename=Date.now()+path.extname(file.name);
                const filepath = "./public/uploads/" +filename ;
                file.mv(filepath, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    
                });
            }
            let newUser = {
                _id:req.user._id,
                nombre: req.body.nombre,
                contra : req.body.contra!="" ? req.body.contra : "",
                email:  req.body.email,
                direccion: req.body.direccion,
                edad: req.body.edad,
                telefono: req.body.telefono,
                profile:filename
            }
            
            let ret=await uservice.updateUsuario(newUser);
            
            if(!ret){
                
                ret.url="perfil";
                res.render('pages/error',ret);
            }else{
                
                res.redirect("/")
            }
            
           
        } catch (error) {
            log.error(error);
            res.status(400).json({error});
        }
    
    }

    


module.exports={Salir,RenderLogin,RenderRegistro,ErrorLogin,Registro,Actualiza,GetUser};
