
const ordenesSchema =require("../models/ordenMongo");
const Mongo =require("../dao/Mongo");
class carritoService extends Mongo {
  constructor() {
   super(ordenesSchema)
  }
  
  getOrdenes = async () => {
    return await this.getAll();
  };
  getOrden= async (id) => {
    return await this.getOne(id);
  };
  getByusuario= async (idusuario) => {
    return await this.model.find({usuario:idusuario});
  };
  addOrden = async (orden) => {
    return await this.save(orden);
  };
  updateOrden = async (id,orden) => {
    return await this.update(id,orden);
  };
  deleteOrden = async (id) => {
    return await this.delete(id);
  };
}

module.exports = carritoService;
