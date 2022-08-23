const mongoose = require('mongoose')
const collection="productos";
const ProductosSc=new mongoose.Schema({
    id:{type:Number},
    timestamp:{type:Number},
    nombre:{type:String},
    descripcion:{type:String},
    codigo:{type:String},
    precio:{type:Number},
    stock:{type:Number},
    foto:{type:String}
    
})
const productosSchema=mongoose.model(collection,ProductosSc);
module.exports=productosSchema;
