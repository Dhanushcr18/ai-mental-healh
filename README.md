# MoodFlow - AI Mental Health Journal Analyzer

A compassionate digital sanctuary where you can reflect on your daily thoughts and receive deep emotional insights powered by Google Gemini AI.

## Project Overview
MoodFlow is a high-fidelity wellness application designed to help users track their mental states, identify emotional patterns, and receive personalized support through actionable suggestions and affirmations.

## Tech Stack
- **Frontend**: React.js with Vite
- **AI Engine**: Google Gemini 3 Flash (via `@google/genai` SDK)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion (via `motion/react`)
- **Icons**: Lucide React
- **Storage**: LocalStorage (for persistent journal history)

## How It Works
1. **Reflect**: Write down your thoughts, feelings, and experiences in the "Write" tab (min. 10 words).
2. **Analyze**: Our AI analyzer processes your text to detect primary moods and emotional trends.
3. **Insight**: Receive a detailed breakdown including:
   - **Mood Badge**: Quick visual indicator of your emotional state.
   - **Mood Scores**: Quantifiable metrics for Mood, Clarity, and Confidence.
   - **Emotional Patterns**: A descriptive analysis of detected sentiments.
   - **Daily Affirmation**: A personalized message of encouragement.
   - **Mindful Suggestions**: Three actionable steps to improve or maintain your mental state.
4. **Track**: All your entries are stored locally on your device, allowing you to browse your emotional journey over time.

## Setup Instructions
The application is pre-configured for the AI Studio environment. To run it locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Set Environment Variables**:
   Create a `.env` file in the root and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Design Philosophy
- **Calmness**: Uses a soft palette of whites, slates, and teals.
- **Organic Feel**: Combines modern Inter sans-serif for UI with elegant Playfair Display serif for reflective content.
- **Polish**: Smooth transitions and subtle shadows create a premium, trustworthy feel.

---
*Note: This app stores all your data locally for privacy. Clearing your browser cache or switching devices will reset your journal history.*
