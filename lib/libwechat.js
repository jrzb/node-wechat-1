var crypto=require('crypto');
var parser=require('xml2js');
var token = require('../setting.json').wechat.token;

exports.auth=function(req,res,next){
    var query=req.query;
    var signature=query['signature'];
    var timestamp=query['timestamp'];
    var nonce=query['nonce'];
    var echostr=query['echostr'];

    var invalid=(typeof signature=='undefined')||(typeof timestamp=='undefined')||(typeof nonce=='undefined');

    if(!invalid){
    var autharray=new Array(token,timestamp,nonce);
    var shasum=crypto.createHash('sha1');
    autharray.sort();
    shasum.update(autharray.join(''));
    if(shasum.digest('hex')===signature)
        next();
    }
    else
        next(401);
};

exports.bodyParser=function(req,res,next){
    var body='';
    if(req.method==='POST'){
    req.on('data',function(chunk){body +=chunk;});
    req.on('end',function(){
        req.rawbody=body.toString('utf8');
        if(!req.is('text/xml'))
            next(403);
        else
            parser.parseString(body,function(err,result){
                if(err)
                    next(403);
                else{
                    req.body=result.xml;
                    next();
                }

            });
    });
    }
    else next();
};