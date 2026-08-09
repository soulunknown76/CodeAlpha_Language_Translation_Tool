# 🌐 CodeAlpha Language Translation Tool

A modern, full-featured **Language Translation Application** built with **React**, **Vite**, and **Vanilla CSS**. Designed with a sleek dark glassmorphism interface, real-time translations, speech recognition, text-to-speech voice synthesis, and translation history management.

---

## ✨ Features

- 🌍 **25+ Global Languages**: Supports translation between English, Spanish, French, German, Japanese, Chinese, Hindi, Arabic, Russian, and many more with flag indicators.
- ✨ **Auto Language Detection**: Automatically detects the input language when set to `Auto Detect`.
- 🎙️ **Voice Input (Speech-to-Text)**: Speak directly into your microphone to capture speech and convert it into text using the Web Speech API.
- 🔊 **Voice Output (Text-to-Speech)**: Listen to original or translated text pronounced natively in the selected target language.
- 📑 **Translation History & Favorites**: Save, search, filter by favorites, and export your translation history locally.
- 📋 **One-Click Copy & Swap**: Instantly copy text to clipboard or swap source and target languages with smooth animations.
- ⚙️ **API Configuration**: Powered by MyMemory Translation API with optional custom API key configuration.
- 🎨 **Modern Glassmorphism UI**: Beautiful dark theme, vibrant gradients, micro-animations, toast notifications, and celebration confetti.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile screens.

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Translation Engine**: MyMemory API (Free & Keyless fallback)
- **Browser APIs**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), `localStorage`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd CodeAlpha_Language_Translation_Tool
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at:
- **Local**: [http://localhost:3000/](http://localhost:3000/)
- **Network**: Exposed on your local IP address for mobile testing on the same Wi-Fi network.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the built app locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
CodeAlpha_Language_Translation_Tool/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── TranslationCard.jsx
│   │   ├── HistoryDrawer.jsx
│   │   ├── ApiSettingsModal.jsx
│   │   └── Toast.jsx
│   └── services/
│       ├── translationService.js
│       └── speechService.js
```

---

## 🌐 Deploying Online (Free)

### Netlify Drop (30 Seconds)
1. Run `npm run build` to generate the `dist` folder.
2. Drag and drop the `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root and follow the quick login prompts.

---

## 📜 License

This project was built for educational purposes as part of the CodeAlpha Internship Program.