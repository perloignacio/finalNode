const carritoService = require("../services/carrito");
const cs = new carritoService();

const productosService = require("../services/productos");
const ps = new productosService();

const ordenService = require("../services/orden");
const os = new ordenService();

const logger=require("../utils/logger");
const log=new logger();


const email=require("../utils/email");
let EnviaMail=new email();

const phoneHelper=require("../utils/phone");
let notificacion=new phoneHelper();


    const ObtenerProductosCarrito = async (req, res) => {
        try {
            
            let c=await cs.getByusuario(req.user._id);
            if(c!=null){
                
                let items=[];
                let acu=0;
                for(const p of c.productos){
                    let prod=await ps.getProducto(p.producto)
                    acu+=prod.precio*p.cantidad;
                    items.push({
                        producto:prod,
                        cantidad:p.cantidad
                    })
                };
                res.status(200).json({total:acu,data:items});
            }else{
                res.status(404).json({error:"carrito no encontrado"});
            }
        } catch (error) {
            log.error(error);
            res.status(400).json({error});
        }
    
    }

    const itemsCarrito = async (req, res) => {
        try {
            let tmp=await cs.getByusuario(req.user._id);
            if(tmp!=null){
                res.status(200).json(tmp.productos.length);
            }else{
                res.status(200).json(0);
            }
        } catch (error) {
            log.error(error);
            res.status(400).json({error});
        }
    
    }

    const AgregarProductos= async(req,res)=>{
        try{
            let c=await cs.getByusuario(req.user._id);
            if(c){
                let valid=await validarProd(c,req.body.idproducto,req.body.cantidad,'agregar');
                if(valid=="ok"){
                    c.productos.push({producto:req.body.idproducto,cantidad:req.body.cantidad});
                    cs.updateCarrito(c._id,c);
                    res.status(200).json({mensaje:"Producto agregado al carrito"})
                }else{
                    res.status(404).json({mensaje:valid})
                }
                
                
            }else{
                res.status(404).json({mensaje:"Carrito no encontrado"})
            }

           
        }catch(error){
            log.error(error);
            res.status(404).json({mensaje:"Ocurrio un error al procesar la solicitud"});
        }
        
    }

    

    
    const QuitarProducto= async(req,res)=>{
        try{
            let c=await cs.getByusuario(req.user._id);
            let index=c.productos.findIndex((cp)=>cp.producto==req.params.idproducto);
            if(index!=-1){
                c.productos.splice(index,1);
                cs.updateCarrito(c._id,c);
                res.status(404).json({mensaje:"El producto se quito del carrito"});
            }else{
                res.status(404).json({mensaje:"Producto no encontrado"});
            }
           
        }catch(err){
            log.error(error);
            res.status(400).json({mensaje:"Ocurrio un error inesperado"});
        }
         
    }

    const Confirmar= async(req,res)=>{
        try{
            let c=await cs.getByusuario(req.user._id);
            let items=[];
            let acu=0;
            let valid="";
            let error=false;
            for(const prod of c.productos){
                valid=await validarProd(c,prod.producto,prod.cantidad,'actualizar');
                if(valid!="ok"){
                    error=true;
                }
            }
            
            if(!error){
                for(const p of c.productos){
                    let prod=await ps.getProducto(p.producto)
                    acu+=prod.precio*p.cantidad;
                    items.push({
                        nombre:prod.nombre,
                        foto:prod.foto,
                        cantidad:p.cantidad,
                        precio:prod.precio
                    })
                };
                let data={
                    user:req.user,
                    total:acu,
                    productos:items
                }
                await EnviaMail.enviarAdmin("nuevoPedido",data);
                const smsMsg = `Gracias ${req.user.nombre}, hemos recibido su pedido y se encuentra en proceso de preparación. Próximamente recibirá novedades en su email.`
                const whatMsg = `Nuevo pedido de ${req.user.nombre} (${req.user.email})`
                await notificacion.EnviarMsj(smsMsg,false);
                await notificacion.EnviarMsj(whatMsg,true);
                

                /*Crea la orden*/
                let orden={
                    timestamp:Date.now(),
                    estado:"Solicitada",
                    email:req.user.email,
                    items : c.productos,
                    usuario:req.user
                }
                os.addOrden(orden);

                /*Borra el carrito*/ 
                cs.deleteCarrito(c._id);
                res.status(200).json({mensaje:"ok"});
            }else{

            }
            
        }catch(err){
            log.error(err);
            res.status(400).json({mensaje:"Ocurrio un error inesperado"});
        }
         
    }

    const Vaciar= async(req,res)=>{
        try{
            let c=await cs.getByusuario(req.user._id);
            c.productos=[];
            let resultado=await cs.updateCarrito(c._id,c);
            if(resultado){
                res.status(200).json({mensaje:"El carrito se vacio correctamente"});
            }else{
                res.status(404).json({error:"Error inesperado"});
            }
        }catch(err){
            log.error(err);
            res.status(400).json({err});
        }
         
    }

    const Actualizar= async(req,res)=>{
        try{
            let lista=JSON.parse(req.body.lista);
            let c=await cs.getByusuario(req.user._id);
            let error=false;
            let valid="";
            
            for(const prod of lista){
                valid=await validarProd(c,prod.id,prod.cant,'actualizar');
                
                if(valid=="ok"){
                    let index=c.productos.findIndex((cp)=>cp.producto==prod.id);
                    c.productos[index].cantidad=prod.cant;
                    cs.updateCarrito(c._id,c);
                }else{
                    error=true;
                }

            }
            if(!error){
                res.status(200).json({mensaje:"El carrito se actualizo correctamente"});
            }else{
                res.status(400).json({mensaje:valid});
            }
            
            
        }catch(err){
            log.error(err);
            res.status(400).json({err});
        }
         
    }

    const validarProd=async (c,idproducto,cantidad,operacion)=>{
        let prod=await ps.getProducto(idproducto);
        let mensaje="ok";
        if(cantidad>0){
            if(prod){
                if(cantidad<=prod.stock){
                    if(operacion=="agregar"){
                        let index=c.productos.findIndex((cp)=>cp.producto==idproducto);
                        if(index!=-1){
                            mensaje="El producto ya se encuentra en el carrito";
                        }
                    }
                    
                    
                }else{
                    mensaje="No hay stock suficiente";
                }
            }else{
                mensaje="producto no encontrado";
            }
        }else{
            mensaje="La cantidad no puede ser menor a 0";
        }
        
        return mensaje;
    }

    
    
    

   


module.exports={
    ObtenerProductosCarrito,
    itemsCarrito,
    AgregarProductos,
    QuitarProducto,
    Vaciar,
    Actualizar,
    Confirmar
}