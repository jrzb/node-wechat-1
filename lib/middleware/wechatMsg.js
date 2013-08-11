
module.exports = function(options){
return function wechatMsg(req,res,next){
    if(req.method != 'POST')
	next();
    var msg = {};
    msg.time= new Date;
    msg.mtype = 'unknown';
    if(!req.is('text/xml')){
	msg.type = 'json';
	msg.body = req.body;
	if(req.body.access_token){
		msg.mtype = 'success';	
    		msg.access_token = req.body.access_token;
		msg.expires_in = req.body.expires_in;
	} else if(req.body.errcode) {
		msg.mtype = 'error';
		msg.errcode = req.body.errcode;
		msg.errmsg = req.body.errmsg;
	}
    } 
    else{
	if('undefined' == typeof req.body.xml)
		return next(400);
	msg.body = req.body.xml;	
    	msg.type = 'xml';
    	msg.mtype = msg.body.MsgType;
    	msg.userid = msg.body.FromUserName;
    	msg.platformid = msg.body.ToUserName;
    	msg.mid = msg.body.MsgId;
	msg.ctime = msg.body.CreateTime;
    	if (msg.mtype=='text')
            msg.content = msg.body.Content;
    	else if(msg.mtype=='image')
            msg.picurl = msg.body.PicUrl;
    	else if(msg.mtype=='location'){
            msg.location_x = msg.body.Location_X;
            msg.location_y = msg.body.Location_Y;
            msg.scale = msg.body.Scale;
            msg.lable = msg.body.Lable;
    	}
    	else if(msg.mtype=='link'){
            msg.title = msg.body.Title;
            msg.desciption = msg.body.Description;
            msg.url = msg.body.Url;
    	}
    	else if(msg.mtype=='voice'){
            msg.mediaid = msg.body.MediaId;
            msg.format = msg.body.Format;
            msg.recognition = msg.body.Recognition;
    	}
    	else if(msg.mtype=='event'){
            msg.event = msg.body.Event;
            msg.eventkey = msg.body.EventKey;
    	}
    	else{
            //msg.mtype='unknown'; 
    	}
    }
    req.wechatMsg = msg;	
    next();
};

};
