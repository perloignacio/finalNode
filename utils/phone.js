const logger=require("../utils/logger");
const log=new logger();
const twilio =require('twilio');
const client = twilio(process.env.TWSSID, process.env.TWTOKEN)
class phoneHelper{
    
    async EnviarMsj( body, wa = false) {
        try {
            let from,to;
            // Los numeros destinos estan limitados a variables de entorno por la version trial
            if (wa) {
                from = `whatsapp:${process.env.TWSENDERWSP}`;
                to = `whatsapp:${process.env.TWPHONE_WSP}`;
            } else {
                from = process.env.TWSENDERSMS;
                to = process.env.TWPHONE;
            } 
            const msg = await client.messages.create({from,to,body});
         } catch (error) {
            log.error(error.message)
         }
    }
}
module.exports=phoneHelper;