
const socket = io()
async function renderProductos(productos){
	const template = await fetch('views/partials/listado.prod.hbs')
	const textTemplate = await template.text()
	const functionTemplate = Handlebars.compile(textTemplate)
	const html = functionTemplate({ productos })
    if(document.querySelector('#lprod')){
        document.querySelector('#lprod').innerHTML = html
    }
	
}

async function renderCarrito(data){
	const template = await fetch('views/partials/listado.carrito.hbs')
	const textTemplate = await template.text()
	const functionTemplate = Handlebars.compile(textTemplate)
    let items=data.data;
	const html = functionTemplate({ items })
    
    if(document.querySelector('#listadoCarrito')){
        document.querySelector('#listadoCarrito').innerHTML = html
    }
    if(document.querySelector('#total')){
        document.querySelector('#total').innerHTML=Number(data.total).toFixed(2);
    }
}

async function renderOrden(data){
    
	const template = await fetch('views/partials/listado.orden.hbs')
	const textTemplate = await template.text()
	const functionTemplate = Handlebars.compile(textTemplate)
    let ordenes=data;
    console.log(ordenes);
	const html = functionTemplate({ ordenes })
    
    if(document.querySelector('#listadoOrden')){
        document.querySelector('#listadoOrden').innerHTML = html
    }
}

async function renderProductosAdmin(data){
    
	const template = await fetch('views/partials/listado.admin.prod.hbs')
	const textTemplate = await template.text()
	const functionTemplate = Handlebars.compile(textTemplate)
   
   
	const html = functionTemplate({ productos:data })
    
    if(document.querySelector('#listadoAdmin')){
        document.querySelector('#listadoAdmin').innerHTML = html
    }
}

async function renderMsj(mensajes){
    console.log(mensajes);
	const template = await fetch('views/partials/mensajes.hbs')
	const textTemplate = await template.text()
	const functionTemplate = Handlebars.compile(textTemplate)
	const html = functionTemplate({ mensajes })
    
	document.querySelector('#listaMensajes').innerHTML = html
    
}

async function getProductosAdmin(){
   fetch('/productos')
   .then(response => response.json())
   .then((data) =>{
        renderProductosAdmin(data);
       
        } 
    ); 
}

async function borrarProd(id){
    fetch("/productos/"+id,
    {   
        method: "DELETE"
    })
    .then(response => response.json())
    .then((data) =>{
         renderProductos(data);
        
         } 
     ); 
 }

async function getItemsCarrito(){
    if(document.querySelector('#totalItems')){
        fetch('/carrito/items')
        .then(response => response.json())
        .then(data => 
            document.querySelector('#totalItems').innerHTML = data
        ).catch((err)=>{
            document.querySelector('#totalItems').innerHTML =0;
        }); 
    }
    
 }

 async function getCarrito(){
    
    fetch('/carrito/productos')
        .then(response => response.json())
        .then(data => {
            
            renderCarrito(data) 
        }
           
    ); 
    
    
 }


 async function getOrdenes(){
    
    fetch('/ordenes/mias')
        .then(response => response.json())
        .then(data => {
            
            renderOrden(data) 
        }
           
    ); 
    
 }

 async function getProductos(){
    
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            
            renderProductos(data) 
        }
           
    ); 
    
 }

 
 
 

function agregarAlCarrito(id){
    
    let data = new FormData();
    data.append( "idproducto", id );
    data.append( "cantidad", document.querySelector('#cantidad_'+id).value );       
    fetch("/carrito",
    {   
        method: "POST",
        body: data
    }).then(function(res){ return res.json(); })
    .then(function(data){ 
        Toastify({
            text: data.mensaje,
            duration: 3000
        }).showToast();
        getItemsCarrito();
    })
}

function actualizarCarrito(){
    
    let div_list = document.querySelectorAll('.producto'); // returns NodeList
    let div_array = [...div_list]; // converts NodeList to Array
    let arrList=[]; 
    div_array.forEach(div => {
        let id=div.querySelector("#idproducto").value;
        let cant=div.querySelector("#cant").value;
        arrList.push({id:id,cant:cant});
        
    });

    let data = new FormData();
    data.append( "lista", JSON.stringify(arrList) );
    //data.append( "cantidad", cant );
    fetch("/carrito/actualizar",
        {   
            method: "PUT",
            body: data   
        }).then(function(res){ return res.json(); })
        .then(function(data){ 
            Toastify({
                text: data.mensaje,
                duration: 3000
            }).showToast();
            
            getCarrito();
        })
   
}

function quitarItem(id){
    
    
    fetch(`/carrito/quitarProducto/${id}`,
    {   method: "DELETE",
    }).then(function(res){ return res.json(); })
    .then(function(data){ 
        Toastify({
            text: data.mensaje,
            duration: 3000
        }).showToast();
        getItemsCarrito();
        getCarrito();
    })
}

function confirmar(){
    
    
    fetch(`/carrito/confirmar`,
    {   method: "POST",
    }).then(function(res){ return res.json(); })
    .then(function(data){ 
        if(data.mensaje=="ok"){
            location.href="gracias";
        }else{
            Toastify({
                text: data.mensaje,
                duration: 3000
            }).showToast();
            getItemsCarrito();
            getCarrito();
        }
    })
}



function vaciar(){
    
     
    fetch("/carrito/vaciar",
    {   
        method: "POST"   
    }).then(function(res){ return res.json(); })
    .then(function(data){ 
        getItemsCarrito();
    })
}
getProductos();
getItemsCarrito();  
/*if(document.querySelector('#listadoproductos')){
    
}*/

function limpiaFormMensaje(){
    document.querySelector('#mensaje').value="";
}


const agregarMsj = document.querySelector('#frmMensajes')
if(agregarMsj){


    agregarMsj.addEventListener('submit', (e) => {
        e.preventDefault()
        if(document.querySelector('#autor').value==""){
            alert("Debe ingresar un email");
            return false;
        }
        if(document.querySelector('#mensaje').value==""){
            alert("Debe ingresar un mensaje");
            return false;
        }

        const msj = {
            autor: document.querySelector('#autor').value,
            fecha: moment().format('DD/MM/YYYY hh:mm'),
            mensaje: document.querySelector('#mensaje').value
        }

        socket.emit('agregarMensaje', msj)
        limpiaFormMensaje();
    })
}

if(document.querySelector('#listadoCarrito')){
    getCarrito();
}
if(document.querySelector('#listadoOrden')){
    getOrdenes();
}

if(document.querySelector('#listadoAdmin')){
    getProductosAdmin();
}
socket.on('mensajes', renderMsj)
socket.emit('getmensajes')