# TODO List

This document tracks planned tasks, features, and improvements for the GitHub Project Dashboard.

## Features

-   [ ] **Search & Filter**: Implement a search bar to filter repositories by name.
-   [ ] **Advanced Filtering**: Add options to filter by language, and public/private status.
-   [ ] **Data Visualization**: Use a library like Chart.js to create a visual pie or bar chart for language distribution.
-   [ ] **Commit History**: Create a view to show the last 5-10 commits for a selected repository, not just the latest one.
-   [ ] **Pagination**: Add pagination for the repository grid for users with a large number of projects.

## UI/UX Improvements

-   [ ] **Theme Toggle**: Implement a light/dark mode switch.
-   [ ] **Loading Skeletons**: Improve the initial loading and detail view loading states with more detailed skeleton screens.
-   [ ] **Mobile Responsiveness**: Further refine the layout for smaller mobile devices, perhaps hiding the sidebar behind a menu button.
-   [ ] **Empty States**: Design a better visual for when no repositories are found or when a repository has no commits.

## Bugs & Refactoring

-   [ ] **Error Handling**: Provide more specific error messages from the GitHub API (e.g., rate limit exceeded, invalid token).
-   [ ] **State Management**: For larger features, consider a simple state management library (like Zustand) to avoid prop drilling.
-   [ ] **Code Cleanup**: Consolidate repetitive Tailwind CSS classes.

---

# 待辦事項

本文件追蹤 GitHub 專案儀表板的計劃任務、功能和改進。

## 功能開發

-   [ ] **搜尋與篩選**: 實作一個搜尋框，可依專案名稱過濾。
-   [ ] **進階篩選**: 新增依程式語言、公開/私有狀態進行篩選的選項。
-   [ ] **數據可視化**: 使用 Chart.js 之類的圖表庫為語言分佈創建圓餅圖或長條圖。
-   [ ] **提交歷史**: 為選定的專案創建一個視圖，顯示最近 5-10 次的提交紀錄，而不僅僅是最新的一次。
-   [ ] **分頁功能**: 為擁有大量專案的使用者在專案網格中添加分頁功能。

## 介面/體驗優化 (UI/UX)

-   [ ] **主題切換**: 實作一個淺色/深色模式的切換開關。
-   [ ] **載入動畫骨架**: 優化初始載入和詳細視圖的載入狀態，使用更精緻的骨架畫面。
-   [ ] **移動端響應式設計**: 進一步優化在小型移動設備上的佈局，例如將側邊欄隱藏在選單按鈕後面。
-   [ ] **空狀態設計**: 為找不到專案或專案沒有任何提交紀錄的情況設計更好的視覺呈現。

## 錯誤修復與重構

-   [ ] **錯誤處理**: 提供來自 GitHub API 的更具體的錯誤訊息（例如：請求頻率超限、無效的權杖）。
-   [ ] **狀態管理**: 為了應對未來更大型的功能，考慮引入一個簡單的狀態管理庫（如 Zustand）以避免 props 逐層傳遞。
-   [ ] **程式碼清理**: 整理重複的 Tailwind CSS class。
