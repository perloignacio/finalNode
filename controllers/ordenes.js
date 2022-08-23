const ordenService = require("../services/orden");
const os=new ordenService();

const productosService = require("../services/productos");
const ps = new productosService();

const getOrdenes = async (req, res) => {
  
  let result = await os.getByusuario(req.user._id);
  let items=[];
  let acu=0;
  for(const orden of result){
    let o={...orden}
    o.prod=[];
    for(const p of orden.items){
      let prod=await ps.getProducto(p.producto)
      acu+=prod.precio*p.cantidad;
      o.prod.push({prod:prod,cant:p.cantidad});
      
    }
    o.fecha=new Date(o._doc.timestamp).toLocaleDateString()
    o.total=acu;
    acu=0;
    items.push(o)
    
  };

  
  res.send(items);
};



module.exports = {
  getOrdenes
};
