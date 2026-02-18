# Pixel Art Quiz Game (React + Google Apps Script)

這是一個基於 React (Vite) 的像素風格問答遊戲，使用 Google Sheets 作為後端資料庫（題目與成績記錄），並透過 Google Apps Script (GAS) 進行 API 溝通。

## ✨ 特色
- **Pixel Art 風格**：復古街機視覺設計。
- **Google Sheets 整合**：題目管理與成績即時上傳。
- **RWD 響應式設計**：支援手機與電腦遊玩。
- **動態關主**：使用 DiceBear API 生成像素風關主。

---

## 🛠️ 安裝與執行 (Installation)

### 1. 下載專案
```bash
git clone <your-repo-url>
cd pixel-game
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 本地執行
```bash
npm run dev
```
啟動後請前往 `http://localhost:5173`。

---

## 📊 Google Sheets 設定 (Database Setup)

請建立一個新的 Google Sheet，並設定以下兩個工作表（Sheet）：

### 工作表 1: `Questions` (題目庫)
請依照以下順序設定第一列（標題列）：
| A | B | C | D | E | F | G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ID** | **Question** | **Option A** | **Option B** | **Option C** | **Option D** | **Answer** |

> **注意**：`Answer` 欄位請填寫正確選項的**內容**（例如 "Paris" 而不是 "B"），或者在此 README 下方的測試題庫中直接複製。

### 工作表 2: `Responses` (成績記錄)
請依照以下順序設定第一列（標題列）：
| A | B | C | D | E | F | G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ID** | **Runs** | **Total Score** | **Max Score** | **First Pass Score** | **Attempts to Pass** | **Last Played** |

---

## 🚀 Google Apps Script 部署 (Backend Setup)

1. 在您的 Google Sheet 中，點擊 `擴充功能 (Extensions)` > `Apps Script`。
2. 將專案內的 `google-apps-script/Code.gs` 內容完整複製並貼上到編輯器中。
3. 存檔 (Ctrl+S)。
4. 點擊右上角 `部署 (Deploy)` > `新增部署 (New deployment)`。
5. 點擊齒輪圖示，選擇 `網頁應用程式 (Web app)`。
6. 設定如下：
    - **執行身份 (Execute as)**: `我 (Me)`
    - **誰可以存取 (Who has access)**: `任何人 (Anyone)` **(重要！)**
7. 點擊 `部署 (Deploy)`，並授權存取權限。
8. 複製產生的 **Web App URL**（以 `https://script.google.com/macros/s/.../exec` 結尾）。

---

## ⚙️ 環境變數設定 (.env)

在專案根目錄建立或編輯 `.env` 檔案：

```ini
# Google Apps Script 的 Web App URL
VITE_GOOGLE_APPS_SCRIPT_URL="您的_WEB_APP_URL"

# 通過門檻 (答對幾題算過關)
VITE_PASS_THRESHOLD=3

# 每次遊戲題目數量
VITE_QUESTION_COUNT=5
```

設定完成後，請**重啟**開發伺服器 (`npm run dev`)。

---

## 🧪 測試題庫：生成式 AI 基礎知識 (Test Data)

您可以直接複製以下內容到 Google Sheets 的 **`Questions`** 工作表（從 A2 開始貼上）：

| ID | Question | Option A | Option B | Option C | Option D | Answer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 什麼是 Generative AI (生成式 AI) 的主要功能？ | 分析數據 | 生成新內容 | 儲存資料 | 執行算術 | 生成新內容 |
| 2 | ChatGPT 是基於哪種架構的模型？ | CNN (卷積神經網絡) | Transformer | RNN (循環神經網絡) | GAN (生成對抗網絡) | Transformer |
| 3 | 下列哪個不是生成式 AI 的應用？ | 撰寫電子郵件 | 生成圖片 | 預測天氣 | Excel 表格加總 | Excel 表格加總 |
| 4 | "Prompt Engineering" 指的是什麼？ | 設計提示詞以引導 AI | 編寫 Python 程式碼 | 訓練硬體加速器 | 清理數據集 | 設計提示詞以引導 AI |
| 5 | Midjourney 主要用於生成什麼類型的內容？ | 文字 | 音樂 | 圖片 | 影片 | 圖片 |
| 6 | 大型語言模型 (LLM) 中的 "Token" 大致等同於？ | 一個單字或字的一部分 | 一個句子 | 一個檔案 | 一個像素 | 一個單字或字的一部分 |
| 7 | 下列哪個是 OpenAI 開發的模型？ | LLaMA | Claude | GPT-4 | PaLM | GPT-4 |
| 8 | 生成式 AI 可能會產生錯誤資訊，這種現象被稱為什麼？ | 幻覺 (Hallucination) | 錯誤 (Error) | 偏差 (Bias) | 雜訊 (Noise) | 幻覺 (Hallucination) |
| 9 | 訓練大型語言模型通常需要什麼？ | 大量標記數據與算力 | 少量手寫規則 | 一台筆記本電腦 | 特定的程式語言 | 大量標記數據與算力 |
| 10 | Stable Diffusion 是一種什麼類型的模型？ | 文字生成文字 | 文字生成圖片 | 圖片生成文字 | 語音生成文字 | 文字生成圖片 |

---

## ☁️ GitHub Pages 自動部署 (Deployment)

本專案已包含 GitHub Actions 設定檔，可自動部署到 GitHub Pages。

### 設定步驟

1. **推送程式碼到 GitHub**
   將專案推送到您的 GitHub Repository。

2. **設定 Secrets (環境變數)**
   - 進入 GitHub Repo > `Settings` > `Secrets and variables` > `Actions`.
   - 點擊 `New repository secret`.
   - **Name**: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - **Value**: (您的 Google Apps Script Web App URL)
   - *(Optional)* 您也可以在 `Variables` 頁籤設定 `VITE_PASS_THRESHOLD` 和 `VITE_QUESTION_COUNT`。

3. **開啟 GitHub Pages 權限**
   - 進入 GitHub Repo > `Settings` > `Pages`.
   - 在 **Build and deployment** > **Source** 選擇 `GitHub Actions`.

4. **觸發部署**
   每次推送到 `main` 分支時，Action 就會自動執行並部署。

