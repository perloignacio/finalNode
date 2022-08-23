require("dotenv").config();
const express = require("express");
const usuariosRoutes = require("./routes/usuarios");
const tiendaRoutes = require("./routes/tienda");
const productosRoutes = require("./routes/productos");
const carritoRoutes = require("./routes/carrito");
const ordenesRoutes = require("./routes/ordenes");
const connectMongo = require("./config/connectMongo");
const session=require("./config/passport");
const passport=require("passport");

const handlebars=require("express-handlebars");
const app = express();
const PORT = 80;
const path =require('path');
const cookieParser=require("cookie-parser");
const fileUpload =require('express-fileupload');

const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')

app.use(express.json());
app.use( express.static('./public') );
app.use(express.urlencoded({ extended: true })) 

app.use(session.baseSession);
session.initPassport();
app.use(passport.initialize());
app.use(passport.session());
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main.hbs",
        layoutsDir: path.join(__dirname,'public/views/layouts/'),
        partialsDir: path.join(__dirname,'public/views/partials/'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
);

app.set("views", "./public/views");
app.set("view engine", "hbs");
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'public/uploads/',
    createParentPath:true
}));
app.use("/", tiendaRoutes);
app.use("/",usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito",carritoRoutes);
app.use("/ordenes",ordenesRoutes);

// conectando a Mongo con Mongoose
const mongo = new connectMongo();
mongo.connect();

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
httpServer.listen(PORT, () => console.log("Server up to", PORT));
app.set('socketio', io);