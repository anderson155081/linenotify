var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const db = require('../database/mongo');
const https = require('https');
const axios = require('axios');

router.get('/',function(req, res, next){
    const state = 'state';
    console.log(process.env["LINE_NOTIFY_CLIENT_ID"]);
    res.redirect(`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${process.env["LINE_NOTIFY_CLIENT_ID"]}&redirect_uri=${process.env['LINE_NOTIFY_CALLBACK_URL']}&scope=notify&state=${state}`);
});

router.get('/callback', async function (req, res, next) {
    const oauthToken = await rp({
      method: 'POST',
      uri: `https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env['LINE_NOTIFY_CALLBACK_URL']}&client_id=${process.env['LINE_NOTIFY_CLIENT_ID']}&client_secret=${process.env['LINE_NOTIFY_CLIENT_SECRET']}`,
      json: true
    });
    console.log(oauthToken["access_token"]);
    db.insert(oauthToken["access_token"]);
    return res.send("連接成功！請關閉此視窗");
});

router.get('/send_message',async function(req, res, next){
  
  // const notify = await rp({
  //   method: 'POST',
  //   url: 'https://notify-api.line.me/api/notify',
  //   auth: {
  //     //todo
  //     'bearer': 'aB9H9sXmDD7FPVGQaxG0c4DgKd7UD5UsHd2EfP8ZUb9',
  //   },
  //   form: {
  //     message: '2021 anderson test'
  //   },
  //   json: true
  // });
  
  db.gettoken(function(result){
    console.log(result.length);
    for(i=0;i<result.length;i++){
      rp({
          method: 'POST',
          url: 'https://notify-api.line.me/api/notify',
          auth: {
            //todo
            'bearer': result[i]['access_token'],
          },
          form: {
            message: `${req.query.money}`
          },
          json: true
        });
  }
  return res.send('a');
  });
});

module.exports = router;