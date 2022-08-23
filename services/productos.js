
const productosSchema =require("../models/productosMongo");
const Mongo =require("../dao/Mongo");
class productosService extends Mongo {
  constructor() {
   super(productosSchema)
  }
  
  getProductos = async () => {
    return await this.getAll();
  };
  getProducto= async (idprod) => {
    return await this.getOne(idprod);
  };
  addProducto = async (prod) => {
    return await this.save(prod);
  };
  updateProducto = async (id,prod) => {
    return await this.update(id,prod);
  };
  deleteProducto = async (id) => {
    return await this.delete(id);
  };
}

module.exports = productosService;
