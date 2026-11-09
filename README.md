# agene official website

HTML / CSS / JavaScript の静的サイトです。ビルド処理はありません。

## ローカル表示

```sh
python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開いてください。

## 主なファイル

- `index.html`: 掲載情報、音源ダウンロード先、利用規約
- `css/style.css`: 配色、余白、PC・スマホレイアウト
- `js/main.js`: スマホメニュー、現在位置表示
- `fonts/`: Cormorant Garamond Italic と OFL ライセンス
- `img/agene-portrait-cutout.png`: PC用TOP人物画像
- `img/agene-portrait-full-head.png`: タブレット・SP用TOP人物画像
- `img/agene-chibis.png`: ちびキャラ切り出し元の保存用スプライト
- `reference/`: ユーザー提供の正式なキャラクター設定画像。変更禁止

通常音源・弱音源の個別配布は準備中です。ファイルが用意できたら該当 `article.release` に実際の配布リンクを追加してください。

## キャラクターデザインの固定事項

立ち絵のクレジットは既存サイトの「さやぴ」を維持しています。新規生成素材を同作者の作品として扱わないでください。

## 見出しの書体

ロゴとセクション見出しは Boska Regular Italic（Indian Type Foundry / Fontshare）をSVGのパスへ変換しています。`img/type/` に5種類を収録。ナビ・本文はテキストです。クレジットは `fonts/Boska-CREDITS.txt` を参照。

追加素材: `img/agene-present.png`（三本線なしの案内）、`img/agene-bow.png`（閉じ目のお辞儀）。

デモはニコニコ動画を別タブで開きます。埋め込みプレイヤーは使用しません。
