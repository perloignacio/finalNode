
const carritoSchema =require("../models/carritoMongo");
const Mongo =require("../dao/Mongo");
class carritoService extends Mongo {
  constructor() {
   super(carritoSchema)
  }
  
  getCarritos = async () => {
    return await this.getAll();
  };
  getCarrito= async (id) => {
    return await this.getOne(id);
  };
  getByusuario= async (idusuario) => {
    return await this.model.findOne({usuario:idusuario});
  };
  addCarrito = async (carrito) => {
    return await this.save(carrito);
  };
  updateCarrito = async (id,carrito) => {
    return await this.update(id,carrito);
  };
  deleteCarrito = async (id) => {
    return await this.delete(id);
  };
}

module.exports = carritoService;
