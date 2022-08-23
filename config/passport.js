const MongoStore=require("connect-mongo");
const session=require("express-session");
const LocalStrategy=require("passport-local").Strategy;
const usuariosService = require("../services/usuarios");
const uservice = new usuariosService();
const passport=require("passport");
const bcrypt = require('bcrypt');


let baseSession = session({
    store: MongoStore.create({
        mongoUrl: process.env.BD,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
    }),
    key: process.env.KEY,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie: {maxAge: 6000000},
})

const initPassport=()=>{
  passport.use("login",new LocalStrategy(
		async (username,password,done)=>{

      let user=await uservice.getByEmail(username);
      
      if(!user){
        return done(null,false);	
      }

      let band=await bcrypt.compare(password, user.contra);
      if(band){
        
        return done(null, user)
      }else{
        return done(null,false);	
      }
        
        
       
		  
	   }
   ));
   
   passport.serializeUser((usuario,done)=>{
	   
	   done(null,usuario._id)
   })
   passport.deserializeUser((id,done)=>{
	  
    uservice.getById(id).then((u)=>{
       
       done(null,u);
	   })
   });	
}

module.exports={baseSession,initPassport};