This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.


> 📌 **Important**: Before running the project, switch to the following branch:

```sh
git checkout GeminiIntegration
```

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.


To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

---

### Step 2: Build and Run Your App

With Metro running, open a **new terminal** and use one of the following commands:

#### ▶️ Android

```sh
npm run android
# OR
yarn android
```

#### 🍏 iOS

For iOS, ensure CocoaPods dependencies are installed:

```sh
bundle install         # First time only
bundle exec pod install  # Every time you update native deps
```

Then run:

```sh
npm run ios
# OR
yarn ios
```

If everything is set up correctly, your app should launch in an emulator or device.

---

### Step 3: Configure Gemini API Key via `.env`

To securely use the Gemini API, store your API key in a `.env` file.
The API key is being used in the ChatScreen Component in the end of endpoint.
You will find text YOUR_API_KEY replace it with your Gemini KEY.

#### 1. Create a `.env` file in your project root:

```env
GEMINI_API_KEY=your_api_key_here
```

#### 2. Install `react-native-dotenv`:

```sh
npm install react-native-dotenv
```

#### 3. Configure Babel

In `babel.config.js`, add:

```js
plugins: [
  ["module:react-native-dotenv"]
]
```

#### 4. Use the key in your code

```ts
import { GEMINI_API_KEY } from '@env';

console.log(GEMINI_API_KEY);
```

#### 5. Run the app

```sh
npm run android
# OR
npm run ios
```

---

## ✨ Features & Libraries

### 🗣️ React Native TTS (`react-native-tts`)
- **What it does**: Adds text-to-speech capabilities.
- **Why**: Improves accessibility and allows users to listen to messages.

### 🤖 Gemini API (via Google AI)
- **What it does**: Provides AI responses using Google's Gemini large language model.
- **Why**: Powers the chatbot’s ability to understand and generate human-like responses.

### 🧮 Markdown + Math Rendering
- **Libraries**:
  - `react-native-markdown-display`
  - `react-native-math-view`
- **What it does**: Supports rendering markdown and LaTeX math equations.
- **Why**: Enables rich text and math formatting directly in chat (e.g., displaying equations like `\(E=mc^2\)`).

