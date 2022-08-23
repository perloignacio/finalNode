const mongoose = require('mongoose')
const collection="mensajes";
const mensajesSc=new mongoose.Schema({
    autor:{type: mongoose.Schema.Types.ObjectId,ref: 'usuarios'},
    fecha:{type:String},
    mensaje:{type:String}
})
const mensajeschema=mongoose.model(collection,mensajesSc);
module.exports=mensajeschema;