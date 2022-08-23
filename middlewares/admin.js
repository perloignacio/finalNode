const admin=true;
module.exports.esAdmin  = function(req, res, next) {

    if (admin === false) {     
        res.status(401).json({error:-1,descripcion:req.url+" "+req.method+" no autorizado"});
       
    } else {
        return next();
    }
}

