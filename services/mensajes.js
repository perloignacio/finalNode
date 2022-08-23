
const mensajeschema =require("../models/mensajesMongo");
const Mongo =require("../dao/Mongo");
class mensajesService extends Mongo {
  constructor() {
   super(mensajeschema)
  }
  
  getMensajes = async () => {
    return await this.getAll();
  };
  getMensaje= async (id) => {
    return await this.getOne(id);
  };
  addMensaje = async (mensaje) => {
    return await this.save(mensaje);
  };
  updateMensaje = async (id,mensaje) => {
    return await this.update(id,mensaje);
  };
  deleteMensaje = async (id) => {
    return await this.delete(id);
  };
}

module.exports = mensajesService;
