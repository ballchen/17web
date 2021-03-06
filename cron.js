'use strict'

let user = require('./local').app
let request = require('request')
let uuid = require('node-uuid')
let moment = require('moment')
let fs = require('fs')

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '0 */10 * * * *',
  onTick: function(){
    let time = moment().format('YYYYMMDD-HHmm');
    const api = 'http://api-dsa.17app.co/apiGateWay'
    const headers = {
      'User-Agent': 'okhttp/2.0.4',
      'Host': 'api-dsa.17app.co',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip',
      'Connection': 'Keep-Alive'
    }
    let hotlivestream = '{"region":"local","userID":"' + user.id + '","accessToken":"' + user.token + '","count":15,"nonce":"' + uuid.v4() + '","deviceType":"ANDROID","deviceID":"","action":"getHotLiveStreams2","ipCountry":"TW","language":"TW","beforeTime":2147483647,"version":"2.0.4"}'
    let data = {
      'data': hotlivestream,
      'key': '',
      'cypher': '0_v2'
    }
    request({
      headers: headers,
      method: 'POST',
      url: api,
      form: data
    }, function(err, response, body){
      let streams = JSON.parse(response.body).data
      fs.writeFileSync('./static/hots/'+time+'.json', streams)
      console.log('%s - %s streams', time, JSON.parse(streams).length)
    })
  },
  start: false,
  timeZone: 'Asia/Taipei'
});
job.start();
