var converter=function (rmsg){
	if('text' == rmsg.mtype){
	var rbody = '<xml><ToUserName><![CDATA['+rmsg.userid+']]></ToUserName> <FromUserName><![CDATA['+rmsg.platformid+']]></FromUserName> <CreateTime>'+rmsg.ctime+'</CreateTime> <MsgType><![CDATA[text]]></MsgType> <Content><![CDATA['+rmsg.content+']]></Content></xml>';
	return rbody;
	}
	if('music' == rmsg.mtype){
	var rbody = '<xml> <ToUserName><![CDATA['+rmsg.userid+']]></ToUserName> <FromUserName><![CDATA['+rmsg.platformid+']]></FromUserName> <CreateTime>'+rmsg.ctime+'</CreateTime> <MsgType><![CDATA[music]]></MsgType> <Music> <Title><![CDATA['+rmsg.title+']]></Title> <Description><![CDATA['+rmsg.description+']]></Description> <MusicUrl><![CDATA['+rmsg.musicurl+']]></MusicUrl> <HQMusicUrl><![CDATA['+rmsg.hqmusic_url+']]></HQMusicUrl></Music></xml>';
	return rbody;
	}
	if('news' == rmsg.mtype){
	var rbody = '<xml><ToUserName><![CDATA['+rmsg.userid+']]></ToUserName><FromUserName><![CDATA['+rmsg.platformid+']]></FromUserName><CreateTime>'+rmsg.ctime+'</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>'+rmsg.articles.length+'</ArticleCount><Articles>';
	rmsg.articles.forEach(function(item){
	rbody += '<item> <Title><![CDATA['+item.title+']]></Title> <Description><![CDATA['+item.description+']]></Description><PicUrl><![CDATA['+item.picurl+']]></PicUrl> <Url><![CDATA['+item.url+']]></Url> </item>';
	});
	rbody +='</Articles></xml>';
	return rbody;
	}
	return '';	

}




module.exports = function(req, res){
	var msg = req.wechatMsg;	
	if('undefined' == typeof msg)
		return res.end('');

	var rmsg={};
	rmsg.userid = msg.userid;
	rmsg.platformid = msg.platformid;
	rmsg.ctime = msg.ctime;
	if('event' == msg.mtype){
		if('CLICK' == msg.event){
		}	
	}
	if('text' == typeof msg.mtype){
	}
	if('image' == typeof msg.mtype){
	}
	if('location' == typeof msg.mtype){
	}
	if('link' == typeof msg.mtype){
	}
	/* for unknown mtype */
	rmsg.mtype='text';
	rmsg.content='Please visit http://www.windyland.me';
	var rbody=converter(rmsg);
	return res.send(rbody);
}

