const nodemailer = require("nodemailer");
const Handlebars =require('handlebars');
const path =require('path');
const fs=require("fs");
const logger=require("../utils/logger");
const log=new logger();
class email{
    constructor(){

    }

    async enviarAdmin(tipo,data){
        try {
            
            let templateFile,templateContent,subject;
        
            if (tipo === 'nuevoRegistro') {
                templateFile = "./public/views/tpl/registro.hbs";
                templateContent = {data};
                subject="Nuevo usuario";
            }
        
            if (tipo === 'nuevoPedido') {
                templateFile = "./public/views/tpl/pedido.hbs";
                const {nombre,email} = data.user;
                templateContent = {usuario:{nombre,email},items:data.productos,total:data.total};
                subject=`Nuevo pedido ${data.user.nombre} - ${data.user.email}`;
               
            }
            
            const emailTemplateSource = fs.readFileSync(templateFile, "utf8")
            const template = Handlebars.compile(emailTemplateSource);
            const htmlMessage = template(templateContent);
            //console.log(htmlMessage)
            await this.enviar(process.env.MAIL, subject, htmlMessage);            
        } catch (error) {
            log.error(error.message)
        }
    }

    async enviar(to,subject,html){
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
            
        });
        
        try {
            const mailOptions = {
                from: 'hola@oddisnuts.com',
                to,
                subject,
                html
            }
            let result=await transporter.sendMail(mailOptions);
            
         } catch (error) {
            log.error(error.message)
         }
    }
}

module.exports=email;