
const usuarioschema =require("../models/usuariosMongo");

const Mongo =require("../dao/Mongo");
class usuariosService extends Mongo  {
  constructor() {
    super(usuarioschema)
  }
  
  getByEmail=async (email)=>{
    return await this.model.findOne({email:email});
  }
  
  getUsusarios= async () => {
    return await this.getAll();
  };
  getById= async (idusuario) => {
    return await this.getOne(idusuario);
  };
  addUsuario = async (usuario) => {
    return await this.save(usuario);
  };
  updateUsuario = async (id,usuario) => {
    return await this.update(id,usuario);
  };
  deleteUsuario = async (id) => {
    return await this.delete(id);
  };
}

module.exports = usuariosService;
