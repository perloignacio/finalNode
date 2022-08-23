const pino=require("pino");
const loggerWarn = pino(pino.destination('./warn.log'))
loggerWarn.level="warn";

const loggerError = pino(pino.destination('./eror.log'))
loggerError.level="error";

const loggerInfo = pino()
loggerInfo.level="info";
    
class Logger{
    
    constructor(){

    }

    warning(message){
        loggerWarn.warn(message)
    }

    info(message){
        loggerInfo.info(message)
    }

    error(message){
        loggerError.error(message)
    }
}

module.exports=Logger;