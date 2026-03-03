# ⚔ 闖關問答 ⚔ (Pixel Quiz Game)

這是一個使用 React + Vite 製作的像素風格闖關問答遊戲。

## 🚀 技術棧
- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (Pixel Art 風格)
- **Backend**: Google Sheets + Google Apps Script
- **Deployment**: GitHub Pages + GitHub Actions

## 🛠 設定流程

### 1. Google Sheets & Apps Script 設定
1. 建立一個新的 Google Sheet。
2. 建立兩個工作表：「題目」與「回答」。
3. 在 A1 分別貼上 `backend.gs` 中說明的 Header 字串。
4. 點擊 `擴充功能 > Apps Script`，貼入 `backend.gs` 的代碼。
5. 部署為「網頁應用程式」，並設定為「所有人」皆可存取。
6. 複製產出的 `Web App URL`。

### 2. 本地開發
1. 複製 `.env.example` 為 `.env`。
2. 填入你的 `VITE_GOOGLE_APP_SCRIPT_URL`。
3. 執行：
   ```bash
   npm install
   npm run dev
   ```

### 3. GitHub Actions 自動部署
本專案已設定好 GitHub Actions。當你推送到 `main` 分支時，會自動進行部署。

#### 設定步驟：
1. 到 GitHub Repository 的 `Settings > Secrets and variables > Actions`。
2. 點擊 `New repository secret`，新增以下三個參數：
   - `VITE_GOOGLE_APP_SCRIPT_URL`: 你的 GAS Web App URL。
   - `VITE_PASS_THRESHOLD`: 通關門檻題數（例如 `8`）。
   - `VITE_QUESTION_COUNT`: 每次遊戲題目數量（例如 `10`）。
3. 往後只需 `git push` 到 `main` 即可自動更新線上版本。

---

## 🎨 UI 設計
- **字型**: `Press Start 2P` (英數), `DotGothic16` (中文)。
- **風格**: 2000 年代街機設計，包含 CRT 掃描線效果與像素外框。
- **角色**: 使用 DiceBear API 自動生成 100 個獨特的像素關主。

## 📦 部署位置
部署後的網站通常位於：`https://<你的帳號>.github.io/quiz_game/`
