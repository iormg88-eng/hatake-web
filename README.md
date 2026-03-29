# Hatake（畑）

農業チーム向けの圃場状態共有Webアプリ。

**→ [https://hatake-web.vercel.app](https://hatake-web.vercel.app)**

## 開発背景
長ネギ13ha・6年の農業現場経験から生まれたプロダクト。
圃場確認後の情報共有が電話・LINEに頼りがちで、病害虫の発生や生育異常をチームに素早く伝える手段がないという課題を解決する。

## 技術スタック
- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- axios / js-cookie

## 主な機能
- 「順調・要確認・緊急」3段階のステータス管理
- 🐛🦠💧🌱✂️🚜 の絵文字タグで状況の種類を即時共有
- 120文字メモで補足情報を追加
- 経過時間表示（24時間以内はHH:MM、以降は○日前）
- 2日以上未更新の圃場を視覚的にグレーアウト
- URLで招待、グループ単位で圃場を管理

## 画面構成
- `/login` `/register` — 認証画面
- `/dashboard` — グループ作成・参加
- `/dashboard/fields` — 圃場一覧（メイン画面）
- `/dashboard/history` — 更新履歴タイムライン

## ローカル起動
```bash
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001 を設定
npm run dev
```

## 関連リポジトリ
- バックエンド: [hatake-api](https://github.com/iormg88-eng/hatake-api)
