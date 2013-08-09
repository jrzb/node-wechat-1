// TODO: merge this file to middleware
var request = require('request');
var wechat = require('./setting.json').wechat;

var url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+wechat.appid+'&secret='+wechat.appsecret;
var url2='https://api.weixin.qq.com/cgi-bin/menu/create?access_token=';

request({url:url},function(err,res,body){
	if(err) return console.log(err);
	var result=JSON.parse(body);
	if('undefined'== typeof result.access_token)
		return console.log(result.errcode+' : '+result.errmsg);
	console.log('access_token: '+result.access_token);

	url2=url2+result.access_token.toString();
	request({url:url2,method:'POST',json:wechat.menu},function(err2,res2,body2){
	if(err2) return console.log(err2);
	var result2=body2;
	if(0 ==  result2.errcode)
		return console.log('done' +' : '+result2.errmsg);
	console.log(result.errcode+' : '+result.errmsg);
	});
	
});
