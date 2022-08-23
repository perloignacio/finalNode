const mongoose = require('mongoose')
const collection="ordenes";
const ordenesSc=new mongoose.Schema({
    id:{type:Number},
    timestamp:{type:Number},
    estado:{type:String},
    email:{type:String},
    items : [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productos'
        },
        cantidad: {
            type: Number,
            required: true
        }
    }
    ],
    usuario:{type: mongoose.Schema.Types.ObjectId,ref: 'usuarios'}
})
const ordenesSchema=mongoose.model(collection,ordenesSc);
module.exports=ordenesSchema;