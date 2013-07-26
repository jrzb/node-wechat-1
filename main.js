var express = require('express')
    , http = require('http')
    , path = require('path')
    , redis = require('redis');
var setting = require('./setting.json');
var libwechat = require('./lib/libwechat');
var app = express();
/*express conf*/


/*express basic conf*/
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
app.use(libwechat.auth);
app.use(libwechat.bodyParser);
app.use(app.router);
app.use(function(req,res,next){

    next();
});
app.use(function(err,req,res,next){
    if(err){
        var datetime= new Date;
        console.log('TIME: '+datetime);
        console.log('SOURCE: '+req.host+'['+req.ip+']');
        console.log('DEST: '+req.originalUrl);
        console.log('Error code: '+err);
        if(req.headers)
            console.log('Body: '+req.headers);
        if(req.rawbody)
            console.log('Body: '+req.rawbody);
    }
    res.connection.removeAllListeners('data');
    res.connection.destroy();
    process.nextTick(function(){
        res.emit('end');
    });
});

/*app.use(express.errorHandler());*/

app.get(setting.http.path, function(req,res){res.send(req.query.echostr);});
app.post(setting.http.path, function(req,res,next){

    var datetime= new Date;
    console.log('TIME: '+datetime);
    console.log('From: '+req.body.FromUserName);
    console.log('To: '+req.body.ToUserName);
    console.log('MsqType: '+req.body.MsgType);
    console.log('MsqId: '+req.body.MsgId);
    var mtype=req.body.MsgType;
    if (mtype=='text')
            console.log('Content: '+req.body.Content);
    else if(mtype=='image')
            console.log('PicUrl: '+req.body.PicUrl);
    else if(mtype=='location'){
            console.log('Location_X: '+req.body.Location_X);
            console.log('Location_Y: '+req.body.Location_Y);
            console.log('Scale: '+req.body.Scale);
            console.log('Label: '+req.body.Lable);
    }
    else if(mtype=='link'){
            console.log('Title: '+req.body.Title);
            console.log('Description: '+req.body.Description);
            console.log('Url: '+req.body.Url);
    }
    else if(mtype=='voice'){
            console.log('MediaId: '+req.body.MediaId);
            console.log('Format: '+req.body.Format);
            console.log('Recognition: '+req.body.Recognition);
    }
    else if(mtype=='event'){
            console.log('Event: '+req.body.Event);
            console.log('EventKey: '+req.body.EventKey);
    }
    else{
            console.log('Unknown Msg: ');
            console.dir(req.body);
    }
    next();
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

