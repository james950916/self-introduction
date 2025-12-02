# 個人簡歷（單頁）

這是一個簡單的個人簡歷單頁範本，包含以下區塊：

- Header（導覽）
- 關於我（About）
- 技能（Skills）
- 經歷（Experience）
- 作品集（Portfolio）
- 聯絡方式（Contact）

如何使用：

1. 直接在本機開啟 `index.html`（雙擊或用瀏覽器開啟）。
2. 若要本機啟動靜態伺服器（推薦），可使用 Python 或 VS Code Live Server：

```powershell
# 使用 Python 3 的簡易 HTTP 伺服器（在本資料夾執行）
python -m http.server 8000; Start-Process "http://localhost:8000"
```

3. 編輯 `index.html` 內的文字、`style.css` 的樣式，或在 `script.js` 加入互動行為。

聯絡／回饋：可直接修改 `index.html` 中的電子郵件連結 `youremail@example.com`。

授權：這是個範本，可自由修改使用。

## 作業紀錄（背景音樂功能）

為了作業需求，曾在 `feature/bg-music` 分支上新增背景音樂功能，並在 `main` 測試合併後立即還原。以下為相關 commit（供審查用）：

- 合併到 `main`（加入背景音樂）： `6caa5a1` — chore: merge feature/bg-music (add background music) for assignment
- 還原該合併（讓 `main` 回到沒有音樂的狀態）： `c6addb8` — Revert "chore: merge feature/bg-music (add background music) for assignment"

另外，該功能的實作 commit 位於分支 `feature/bg-music`：
- `0ecb1e3` — feat(audio): autoplay muted by default; toggle mutes/unmutes and persist preference
- `efb5a40` — feat(audio): use YouTube iframe player for background music (twq-DL-igzc)
- `cadce03` — feat(audio): add background music toggle (feature/bg-music)

如需我把上述摘要寫成單獨的 `ASSIGNMENT.md` 或加入更多說明（例如如何還原 main 狀態），請告訴我。
