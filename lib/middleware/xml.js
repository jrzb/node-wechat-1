var xmlParser = require('xml2js');
var utils = require('connect').utils;

module.exports = function(options){

return function(req,res,next){
    if(req._body) return next();
    req.body = req.body || {};
    if(!utils.hasBody(req)) return next();
    if(!req.is('text/xml')) return next();

    req._body = true;

    var buf='';
    req.setEncoding('utf8');
    req.on('data',function(chunk){buf +=chunk;});
    req.on('end',function(){
	if(0 === buf.length)
		return next(utils.error(400,'invalid xml, empty body'));
	try{
        xmlParser.parseString(buf,function(err,xmlresult){
           if(err)
              next(utils.error(400,err));
           else{
              req.body = xmlresult;
              next();
           }
        });
	}catch(err){
	    err.body=err;
	    err.status=400;
	    return next(err);
	}	
   });
};

};
