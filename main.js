var express = require('express')
    , http = require('http')
    , path = require('path')
    , redis = require('redis');
var setting = require('./setting.json');
var app = express();
express.wechatAuth = require('./lib/middleware/wechatAuth');
express.xml = require('./lib/middleware/xml');
express.wechatMsg = require('./lib/middleware/wechatMsg');


app.set('port', setting.http.port);
var express_env=setting.express.env;
var express_title=setting.express.title;
app.set('env',express_env);
app.set('title',express_title);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.disable('x-powered-by');
/*express middleware conf*/
app.use(express.logger('dev'));
app.use(express.wechatAuth({token:require('./setting').wechat.token}));
app.use(express.xml());
app.use(express.json());
app.use(function(req,res,next){
    if(req.method=='POST' && !req._body)
    	return	next(400);
    next();
});
app.use(express.wechatMsg());
app.use(app.routes);
app.use(function(err,req,res,next){
    var time= new Date;
    console.log('TIME: '+time);
    console.log('SOURCE: '+req.host+'['+req.ip+']');
    console.log('DEST: '+req.originalUrl);
    console.log('Headers: '+req.headers);
    if(err){
        console.log(err);
        if(req.body)
            console.log('Body: '+req.body);
    }
    res.connection.removeAllListeners('data');
    res.connection.destroy();
    process.nextTick(function(){
        res.emit('end');
    });
});

/*app.use(express.errorHandler());*/

app.get(setting.http.path, function(req,res){res.end(req.query.echostr);});
app.post(setting.http.path, function(req,res,next){
    console.dir(req.wechatMsg);
    res.end('');
});
/*start out server*/
var server=http.createServer(app,function(err){
    if(err)
        console.log('Express server cannt start');
});

server.listen(setting.http.port, function(err){
    if(err)
        console.log('Express server cant start');
    else
        console.log('Express server listening on port ' + app.get('port'));
});

