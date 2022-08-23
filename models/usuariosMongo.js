const mongoose = require('mongoose')
const collection="usuarios";
const usuariosSc=new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contra: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: false,
    },
    admin: {
        type: Boolean,
        default: false
    }
})
const usuarioschema=mongoose.model(collection,usuariosSc);
module.exports=usuarioschema;