// TODO: merge this file to middleware
var request = require('request');
var wechat = require('./setting.json').wechat;

var url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+wechat.appid+'&secret='+wechat.appsecret;
var url3='https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=';

request({url:url},function(err,res,body){
	if(err) return console.log(err);
	var result=JSON.parse(body);
	if('undefined'== typeof result.access_token)
		return console.log(result.errcode+' : '+result.errmsg);
	console.log('access_token: '+result.access_token);

	url3=url3+result.access_token.toString();
	request({url:url3},function(err2,res2,body2){
	if(err2) return console.log(err2);
	console.log(body2);
	});
	
});
