# 🛍️ seller

**Supabase ✖️ Next.js ✖️ React ✖️ TypeScript を用いた商品管理アプリケーション**

---

## 💡 使用技術スタック

### フロントエンド
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

### バックエンド（BaaS）
- [Supabase](https://supabase.com/)
- [DeeplAPI](https://support.deepl.com/hc/ja/articles/360021200939-DeepL-API-Free)
---

## 📝 アプリ概要

雑貨屋など、**多様な商品を取り扱う店舗向け**に開発されたWebアプリケーションです。  
以下の機能により、**商品情報の管理・編集・翻訳・共有**が効率的に行えます。

- 商品の在庫・価格・説明文などの管理
- 商品ごとの **QRコード生成**
- **DeepL API** による商品情報の **英語翻訳**

---

## 🔧 主な機能

- 🔐 **ログイン機能**（X・Google・GitHub に対応）
- ➕ **商品投稿機能**（価格、名前、詳細、ターゲット層、在庫数）
- ✏️ **商品編集機能**（価格・在庫の更新）
- 🌐 **DeepL API を使用した翻訳機能**
- 📱 **QRコード生成機能**（商品ページURLを含む）
- 🗑️ **商品削除機能**
- 🔍 **商品名による検索機能**

---

## ⚠️ 実装で苦労したこと

### DeepL翻訳APIの導入とaxios脆弱性

DeepL APIを使用する際、初期は非公式の `deepl` ライブラリを導入しましたが、  
このライブラリが依存していた `axios` に以下の**重大な脆弱性**が存在していました：

- CSRF（クロスサイトリクエストフォージェリ）
- SSRF（サーバーサイドリクエストフォージェリ）
- 資格情報の漏洩リスク

これにより、ユーザー情報や内部APIが危険にさらされる恐れがあり、対応が必要でした。

---

## ✅ 改善策

**axios を使用せず、`fetch` API を使用して DeepL の REST エンドポイントを直接叩く**ことで安全性を確保しました。

```ts
const response = await fetch("https://api-free.deepl.com/v2/translate", {
  method: "POST",
  headers: {
    Authorization: `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ text, target_lang }),
});

```
##今後実装したいこと
-商品決済システムの導入
-デバイスごとのUI/UXの改善
-顧客用と販売側の棲み分け
vercel：https://seller-weld.vercel.app/


