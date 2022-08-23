class ProductosDTO {
  constructor(prod) {
    if(prod){
      this._id = prod._id;
      this.nombre = prod.nombre;
      this.descripcion=prod.descripcion;
      this.codigo=prod.codigo;
      this.precio=prod.precio;
      this.stock=prod.stock;
      this.foto=prod.foto;
    }
    
  }
}

module.exports = ProductosDTO;
