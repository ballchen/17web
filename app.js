'use strict'

require('babel-core/register')
const koa = require('koa')
const app = koa()
const router = require('koa-router')()
const Promise = require('bluebird')
const _ = require('lodash')
const fs = require('fs')
const ejs = require('ejs')
const http = require('http')
const request = require('co-request')
const uuid = require('node-uuid')

const user = require('./local').app
const api = 'http://api-dsa.17app.co/apiGateWay'
const headers = {
  'User-Agent': 'okhttp/2.0.4',
  'Host': 'api-dsa.17app.co',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept-Encoding': 'gzip',
  'Connection': 'Keep-Alive'
}

// logger
app.use(function *(next) {
  const start = new Date()
  yield next
  const ms = new Date() - start
  console.log('%s %s - %s ms', this.method, this.url, ms)
})

router.get('/', function *() {
  const template = fs.readFileSync(__dirname + '/views/index.html', 'utf-8')
  this.body = ejs.render(template)
})

router.get('/hotlivestream', function *() {
  let hotlivestream = '{"region":"local","userID":"' + user.id + '","accessToken":"' + user.token + '","count":15,"nonce":"' + uuid.v4() + '","deviceType":"ANDROID","deviceID":"","action":"getHotLiveStreams2","ipCountry":"TW","language":"TW","beforeTime":2147483647,"version":"2.0.4"}'
  let data = {
    'data': hotlivestream,
    'key': '',
    'cypher': '0_v2'
  }

  let response = yield request({
    headers: headers,
    method: 'POST',
    url: api,
    form: data
  })

  this.status = 200
  this.body = JSON.parse(response.body).data
})

router.get('/user/:id/post', function *() {
  let getUserPost = '{"targetUserID":"'+this.params.id+'","beforeTime":2147483647,"count":15,"action":"getUserPost","userID":"'+user.id+'","deviceID":"","accessToken":"'+user.token+'","nonce":"'+uuid.v4()+'","ipCountry":"TW","version":"2.0.4","language":"TW","deviceType":"ANDROID"}'
  let data = {
    'data': getUserPost,
    'key': '',
    'cypher': '0_v2'
  }

  let response = yield request({
    headers: headers,
    method: 'POST',
    url: api,
    form: data
  })

  this.status = 200
  this.body = JSON.parse(response.body).data
})

router.get('/user/:oid', function *(){
  let getUserInfo = '{"targetOpenID":"'+this.params.oid+'","action":"getUserInfo","userID":"'+user.id+'","deviceID":"","accessToken":"'+user.token+'","nonce":"'+uuid.v4()+'","ipCountry":"TW","version":"2.0.4","language":"TW","deviceType":"ANDROID"}'
  let data = {
    'data': getUserInfo,
    'key': '',
    'cypher': '0_v2'
  }

  let response = yield request({
    headers: headers,
    method: 'POST',
    url: api,
    form: data
  })

  this.status = 200
  this.body = JSON.parse(response.body).data
})

router.get('/stream/:sid', function*(){
  let getLiveStreamInfo = '{"liveStreamID":'+this.params.sid+',"action":"getLiveStreamInfo","userID":"'+user.id+'","deviceID":"","accessToken":"'+user.token+'","nonce":"'+uuid.v4()+'","ipCountry":"TW","version":"2.0.4","language":"TW","deviceType":"ANDROID"}'
  let data = {
    'data': getLiveStreamInfo,
    'key': '',
    'cypher': '0_v2'
  }

  let response = yield request({
    headers: headers,
    method: 'POST',
    url: api,
    form: data
  })

  this.status = 200
  this.body = JSON.parse(response.body).data
})

router.get('/collection', function*(){
  let files = fs.readdirSync(__dirname + '/static/hots')
  this.status = 200;
  this.body = files;
})

app.use(router.routes())
app.use(require('koa-static')(__dirname + '/static'))

app.listen(process.env.PORT || 3020, function () {
  console.log('Server start on Port: ' + (process.env.PORT || 3020))
})
