# 🛍️ seller

**Supabase ✖️ Next.js ✖️ React ✖️ TypeScript を用いた商品管理アプリケーション**

---
## 開発した背景
　このアプリは、私が雑貨店でアルバイトをしていた経験をもとに作成したものです。雑貨店でアルバイトをしている際、海外のお客様や国内のお客様から商品の詳細について聞かれることが多くあり、その度に在庫管理や発注の業務に支障をきたすことが多くありました。この課題を解決するために作ったアプリこそがお店用のアプリ(seller)とお客様用のアプリ(customer)です。
 機能としては、sellerで商品の在庫管理や商品の投稿・削除ができ、custometrでは、お客様が商品情報の詳細を知るために、Reactのライブラリを用いて、商品詳細ページのQRコードを生成できます。この生成したQRコードをコピーまたは印刷し、商品それぞれのプライス(値札)に貼ることで、お客様が商品のQRコードを読み取った際に、customerのQRコードを読み取った商品詳細ページに飛び、商品の値段や商品用途について知れるという機能を有しています。また、お客様が商品にアクセスした際に、アクセスしたアプリ内で検索機能を付与しているので、探している商品がそもそも店舗で取り扱っているのかを知ることができます。



## Supabase ✖️ Next.js ✖️ React ✖️ TypeScriptを用いた４つの理由

1. **Supabase：バックエンドを“即戦力”にするため**
   - 自前でサーバー構築／運用をせずに、PostgreSQL〈RLS〉・認証・ストレージ・リアルタイム機能を即利用可。  
   - 認証・権限管理（RLS）  
   - 店員（seller）とお客様（customer）それぞれにログイン制御やデータアクセス制限を簡単に実装可能。  
   - リアルタイム更新  
   - 在庫数の変動を即座に他のクライアントに反映できるため、複数端末での同時編集にも強い。

2. **Next.js：UI と API を同じリポジトリでまとめるため**
   - **API Routes**  
     Supabase のサーバーサイド呼び出し（Webhook／セキュアなクエリ）を同一コードベースで書ける。  
   - **Incremental Static Regeneration（ISR）**  
     商品一覧ページを高速に配信しつつ、在庫更新があれば数分単位で再生成。  
   - **Vercel 連携**  
     デプロイがワンクリック、プレビュー環境も自動で立ち上がり、アルバイト期間中の素早い検証に最適。

3. **React：コンポーネント分割で機能拡張・再利用を効率的にするため**
   - **コンポーネント駆動開発**  
     「商品カード」「QRコードモーダル」「検索バー」などを分離し、seller／customer 双方で再利用可能。  
   - **豊富なライブラリ**  
     QRコード生成（`react-qr-code` など）、フォーム管理（`react-hook-form`）もすぐ導入できる。  
   - **仮想 DOM の高速描画**  
     大量の商品一覧や検索結果のフィルタリングもスムーズに更新。

4. **TypeScript：開発品質と保守性を高めるため**
   - **静的型付けによるバグ予防**  
     「在庫数は `number`」「商品詳細は `interface` で定義」と型で担保し、実装ミスを減らす。  
   - **エディタ補完の充実**  
     型情報のおかげで IDE が補完・リファクタリングを強力サポート。



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
- ORMツール[prisma](https://www.prisma.io/)
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


