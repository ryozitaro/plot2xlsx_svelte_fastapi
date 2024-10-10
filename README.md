# plot2xlsx_svelte_fastapi

これは [plot2xlsx_dash](https://github.com/ryozitaro/plot2xlsx_dash) を FastAPI と TypeScript で再構築して、一部改変したものです。シートを表すドットがクリックできるようになってます。シート数は最大 5 です。

![localhost_5173_](https://github.com/user-attachments/assets/60157822-fbe6-46ae-9590-db0396e64c2d)



## 必要なもの

FastAPI 実行側で xlsx を書き出す際に BIZ UDPGothic フォントが必要です。

## 実行

```
docker compose up
```

確認する  
[localhost:5173](http://localhost:5173)
