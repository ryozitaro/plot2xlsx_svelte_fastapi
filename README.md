# plot2xlsx_react_fastapi

これは [plot2xlsx_dash](https://github.com/ryozitaro/plot2xlsx_dash) を FastAPI と typescript で再構築して、一部改変したものです。シートを表すドットがクリックできるようになってます。シート数は最大 5 です。

![csv2xlsx_react_fastapi](https://github.com/ryozitaro/plot2xlsx_react_fastapi/assets/126104168/56372a5c-8292-4320-ba3d-e396af06c268)


## 必要なもの

FastAPI 実行側で xlsx を書き出す際に BIZ UDPGothic フォントが必要です。

## 実行

```
docker compose up
```

確認する  
[localhost:3000](http://localhost:3000)
