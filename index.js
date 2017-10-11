'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
    myToken: process.env.MY_TOKEN,
};

const client = new line.Client(config);
const app = express();

// グループ記憶用
const groups = [];

app.post('/webhook', line.middleware(config), (req, res) => {
    // おうむ返し
	Promise
		.all(req.body.events.map(handleEvent))
		.then((result) => res.json(result));
});

app.post('/message', bodyParser.urlencoded({ extended: true }), bodyParser.json(), (req, res, next) => {
   
    // 独自の認証をかける
    if (!req.query.token || req.query.token != myToken) {
        res.json({status: 401, message: 'token is invalid'})
        return;
    }

    // リクエストフォーマットのバリデーション
    if (!req.body || !req.body.message) {
        res.json({status: 400, message: 'json should have "message" property'})
        return;
    }

    // LINE形式のメッセージを作成
    const message = {
        type: 'text',
        text: req.body.message,
    };

    // 宛先グループの確認
    if (!groups.length) {
        console.log('no groups to post message');
        res.json({status: 404, message: 'no groups to post message'});
        return;
    }

    // 宛先グループ全てにメッセージを送信
    groups.forEach((group) => {
        client.pushMessage(group, message)
            .then(() => {
                console.log('suceess to send push message.');
                res.json({status: 200, message: 'success'});
            })
            .catch((err) => {
                console.error(err);
                res.json({status: 500, message: 'failed'});
            });
    });
});

function handleEvent(event) {
    if (event.type == 'join' && event.source && event.source.type == 'group') {
        // グループに参加したらグループIDを記憶する
        groups.push(event.source.groupId);
		return Promise.resolve(null);
    }

    console.log('handleEvent second stage.');
	if (event.type !== 'message' || event.message.type !== 'text') {
		// ignore non-text-message event
		return Promise.resolve(null);
	}

    console.log('handleEvent third stage.');
	// create a echoing text message
	const echo = { type: 'text', text: event.message.text };

	// use reply API
    console.log(`replay echo message: ${event.message.text}`);
	return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
