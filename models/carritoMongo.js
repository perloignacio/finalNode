const mongoose = require('mongoose')
const collection="carritos";
const carritoSc=new mongoose.Schema({
    id:{type:Number},
    timestamp:{type:Number},
    productos : [{
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
const carritoSchema=mongoose.model(collection,carritoSc);
module.exports=carritoSchema;