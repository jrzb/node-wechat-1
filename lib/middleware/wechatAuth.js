var crypto=require('crypto');

module.exports = function(options){
    var token=options.token || '';

return function wechatAuth(req,res,next){
    var query=req.query;
    if('undefined' == typeof query)
	return next(401);
    var signature=query['signature'];
    var timestamp=query['timestamp'];
    var nonce=query['nonce'];
    var echostr=query['echostr'];

    var invalid=(typeof signature=='undefined')||(typeof timestamp=='undefined')||(typeof nonce=='undefined');
    req.valid = false;
    if(invalid)
	return next(401);
    var autharray=new Array(token,timestamp,nonce);
    var shasum=crypto.createHash('sha1');
    autharray.sort();
    shasum.update(autharray.join(''));
    if(shasum.digest('hex')==signature){
	req.valid = true;
        return next();
    }
    else
	next(401);
};

};
