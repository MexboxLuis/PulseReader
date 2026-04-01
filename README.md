# Welcome to PulseReader 📰

Welcome to the **PulseReader** repository. This is a cross-platform mobile application built with React Native and Expo, designed to fetch, parse, and display RSS feeds. By default, it is configured to pull the latest official press releases and news from INEGI (Mexico's National Institute of Statistics and Geography).

---

## 📚 About The Project

| Feature                | Details |
| ---------------------- | ------- |
| 🎯 **Purpose**         | A mobile RSS reader that allows users to quickly browse news feeds, read summaries, and view full articles in an integrated browser. |
| ⚙️ **Architecture**     | Built with React Native and Expo, strongly typed with TypeScript. |
| 💾 **State Management**| Uses Redux Toolkit for global state handling and asynchronous data fetching. |
| 🔄 **Core Operations** | Fetch XML data, apply regex-based tag formatting, parse RSS content, and navigate through a tab-based UI. |

---

## 🚀 Tech Stack

### Framework & UI

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

- **React Native & Expo:** Core framework for building a cross-platform (iOS/Android) mobile application quickly and efficiently.
- **React Navigation:** Handles the bottom tab navigation (`Feeds`, `FeedDetails`, `ArticleView`).
- **React Native Webview:** Renders the full web content directly inside the application.

### State Management & Data

![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

- **Redux Toolkit:** Manages the application state, specifically handling the async thunks (`fetchFeeds`) to load and store RSS data.
- **React Native RSS Parser:** Parses the fetched XML data into usable JavaScript objects.

---

## 🔧 Highlighted Features

| Feature | Description |
|--------|------------|
| **Custom XML Formatting** | Includes a regex pre-processing step (`replace(/<row>/g, '<item>')`) to handle and fix non-standard XML formats from specific APIs before parsing. |
| **In-App Browser** | Uses `WebView` to open article links seamlessly without forcing the user out to a third-party browser. |
| **Async State Handling** | Built-in loading states and error handling via Redux extraReducers, ensuring a smooth user experience while fetching data. |
| **Tabbed Interface** | Simple, intuitive Bottom Tab Navigation integrated with vector icons (`Ionicons`). |

---

## 📸 Screenshots

- ![Feed List](assets/Feeds.jpeg)
- ![Feed Details](assets/FeedDetails.jpeg)
- ![Article Web View](assets/ArticleWebView.jpeg)

*(Note: Create an `assets` folder in your repository and replace the placeholders with actual screenshots)*

---

## 🛠️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/MexboxLuis/PulseReader.git
cd PulseReader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo Server
```bash
npx expo start
```

### 4. Run on your device

- Press **a** to open in an Android Emulator.
- Press **i** to open in an iOS Simulator.
- Or scan the QR code with the Expo Go app.
