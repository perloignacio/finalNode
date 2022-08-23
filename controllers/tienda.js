const carritoService = require("../services/carrito");
const cs = new carritoService();

const usuariosService = require("../services/usuarios");
const us = new usuariosService();

const productosService = require("../services/productos");
const ps = new productosService();

const mensajesService = require("../services/mensajes");
const ms = new mensajesService();

const logger=require("../utils/logger");
const log=new logger();
let socket_id = [];
const renderHome = async (req, res) => {
  try {
    let tmp=await cs.getByusuario(req.user._id);
    if(tmp==null){
      let tmp={timestamp:Date.now(),productos:[],usuario:req.user._id};
      await cs.addCarrito(tmp);
    }
    res.render('pages/main',{usuario:req.user.nombre,puerto:process.env.PUERTO,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderCarrito = async (req, res) => {
  try {
    
    res.render('pages/carrito',{usuario:req.user.nombre,puerto:process.env.PUERTO,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderGracias = async (req, res) => {
  try {
    
    res.render('pages/gracias',{usuario:req.user.nombre,puerto:process.env.PUERTO,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderConfig = async (req, res) => {
  try {
    
    let {BD,PUERTO,KEY,SECRET,MAIL,SMTP_HOST,SMTP_USER,SMTP_PASS,SMTP_PORT,TWSSID,TWTOKEN,TWSENDERSMS,TWSENDERWSP,TWPHONE_WSP,TWPHONE}=process.env;
    
      
    
    res.render('pages/config',{BD,PUERTO,KEY,SECRET,MAIL,SMTP_HOST,SMTP_USER,SMTP_PASS,SMTP_PORT,TWSSID,TWTOKEN,TWSENDERSMS,TWSENDERWSP,TWPHONE_WSP,TWPHONE,usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin});
    //res.render('pages/config',{,config:});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderPerfil = async (req, res) => {
  try {
    
    res.render('pages/register',{usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderChat = async (req, res) => {
  try {
    
    
    res.render('pages/chat',{usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin});
    let io = req.app.get('socketio');
    io.on('connection', socket => {
      socket_id.push(socket.id);
      if (socket_id[0] === socket.id) {
        // remove the connection listener for any subsequent 
        // connections with the same ID
        io.removeAllListeners('connection'); 
      }

      socket.on('getmensajes',async ()=>{
        io.sockets.emit('mensajes', await formatMsj())
      })
      socket.on('agregarMensaje', async data => {
        console.log("entro");
        await ms.addMensaje({autor:req.user._id,mensaje:data.mensaje,fecha:data.fecha});
        io.sockets.emit('mensajes', await formatMsj())
      })
    })
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const formatMsj=async()=> {
  let mensajes=await ms.getMensajes();
  let fm=[];
  for(const m of mensajes){
    let obj={...m._doc};
    let u=await us.getById(m.autor);
    obj.usuario=u;
    fm.push(obj);
  }
  return fm;
} 
const renderAdmin = async (req, res) => {
  try {
    
    res.render('pages/admin',{usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderAdminProducto = async (req, res) => {
  try {
    if(req.params.id){
      let prod=await ps.getProducto(req.params.id);
      res.render('pages/producto',{usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin,prod:prod});
    }else{
      res.render('pages/producto',{usuario:req.user.nombre,puerto:process.env.PUERTO,userLogged:req.user,admin:req.user.admin});
    }
    
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const renderOrdenes = async (req, res) => {
  try {
    
    res.render('pages/orden',{usuario:req.user.nombre,puerto:process.env.PUERTO,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};

const ficha = async (req, res) => {
  try {
    let prod=await ps.getProducto(req.params.idproducto);
    res.render('pages/ficha',{usuario:req.user.nombre,puerto:process.env.PUERTO,prod,admin:req.user.admin});
  } catch (error) {
      log.error(error);
      res.status(400).json({error});
  }
};




module.exports = {
  renderHome,
  renderCarrito,
  ficha,
  renderGracias,
  renderOrdenes,
  renderPerfil,
  renderAdmin,
  renderAdminProducto,
  renderChat,
  renderConfig
 
};
