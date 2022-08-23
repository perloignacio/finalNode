const checkSession  = function(req, res, next) {

    
	if(req.isAuthenticated()){
		next();	
	}else{
		res.redirect("login");
	}
}

const checkAdmin  = function(req, res, next) {

    
	if(req.user.admin){
		next();	
	}else{
		res.redirect("login");
	}
}

module.exports={checkSession,checkAdmin}