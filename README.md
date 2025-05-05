# 🛍️ seller

**Supabase ✖️ Next.js ✖️ React ✖️ TypeScript を用いた商品管理アプリケーション**

---

## 💡 使用技術スタック

### フロントエンド
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

### バックエンド（BaaS）
- [Supabase](https://supabase.com/)
- [DeeplAPI](https://support.deepl.com/hc/ja/articles/360021200939-DeepL-API-Free)
- [stripe](https://stripe.com/)
---

## 📝 アプリ概要

雑貨屋など、**多様な商品を取り扱う店舗向け**に開発されたWebアプリケーションです。  
以下の機能により、**商品情報の管理・編集・翻訳・共有・購入**が効率的に行えます。

- 商品の在庫・価格・説明文などの管理
- 商品ごとの **QRコード生成**
- **DeepL API** による商品情報の **英語翻訳**
- 商品の購入機能(デモ購入：o円設定)

---

## 🔧 主な機能

- 🔐 **ログイン機能**（X・Google・GitHub に対応）
- ➕ **商品投稿機能**（価格、名前、詳細、ターゲット層、在庫数）
- ✏️ **商品編集機能**（価格・在庫の更新）
- 🌐 **DeepL API を使用した翻訳機能**
- 📱 **QRコード生成機能**（商品ページURLを含む）
- 🗑️ **商品削除機能**
- 🔍 **商品名による検索機能**
- 🛍️ **商品購入機能（Stripeを利用したCheckout画面遷移）**
- 💻・📱PCとスマホでHeaderのcssの区別化(スマホはハンバーガーメニューを使用)

---

## ⚠️ 実装で苦労したこと

### DeepL翻訳APIの導入とaxios脆弱性

DeepL APIを使用する際、初期は非公式の `deepl` ライブラリを導入しましたが、  
このライブラリが依存していた `axios` に以下の**重大な脆弱性**が存在していました：

- CSRF（クロスサイトリクエストフォージェリ）
- SSRF（サーバーサイドリクエストフォージェリ）
- 資格情報の漏洩リスク

これにより、ユーザー情報や内部APIが危険にさらされる恐れがあり、対応が必要でした。

### Stripe決済機能の初実装

環境変数の設定やJSON形式での商品情報送信、
Prismaを経由してSupabaseと連携する設計
に初挑戦し、認証やエラーハンドリングを含めた構成に苦労しました。

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
-Stripe Checkoutの導入により、シンプルかつ安全な購入フローを構築。
-PrismaとSupabaseを連携し、バックエンド管理を一元化。

---
##今後実装したいこと
- 正式な商品決済システムの導入
- 顧客用と販売側の棲み分け→セキュリティ上の懸念から顧客用のアプリ：customer,販売者側のアプリ：sellerに差別化することに決定
---
vercel：https://seller-weld.vercel.app/


