# これは何？
おうむ返し＋WebAPI(/message)でメッセージをPushするLINE Botです。

## セットアップ
Node.jsのPaaSである`Now.sh`にデプロイして使います。
事前にLINE Messaging APIのChannel-Secret-IDとChannel-Access-Tokenを取得しておきます。

```bash
$ npm install -g now
$ npm install
$ now secret add line-toke XXXX-XXXX-XXXX
$ now secret add line-secret YYYY-YYYY-YYYY
$ now secret add my-secret ZZZZ-ZZZZ-ZZZZ
$ now
$ npm run deploy
```

## 使い方
LINE Botをグループに招待したのち、curlなどWebAPIを叩きます。
URLはnow.shにデプロイ時に表示されます。

```bash
curl -H "Accept: application/json" -H "Content-type: application/json" -XPOST https://xxxxx.now.sh/message -d '{"message": "学校から帰ったよ！"}'
```
