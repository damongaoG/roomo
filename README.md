
# 📱 Running Ionic App with Capacitor

This guide will help you run the Ionic project on **iOS** and **Android** platforms using **Capacitor**.

---

## ✅ Prerequisites

Make sure you have the following installed:

- Node.js & npm  
- Ionic CLI  
- Capacitor (`@capacitor/core`)  
- iOS/macOS: Xcode  
- Android: Android Studio, Java SDK, Android SDK  

---

## 🍏 Run on iOS

1. **Install Capacitor iOS package:**

   ```bash
   npm install @capacitor/ios
   ```

2. **Add the iOS platform:**

   ```bash
   npx cap add ios
   ```

3. **Open the project in Xcode:**

   You can use either command:

   ```bash
   npx cap open ios
   ```

   Or manually:

   ```bash
   open ios/App/App.xcworkspace
   ```

4. **Run the project:**

   In Xcode, choose a simulator or connected device, then click the Run ▶️ button.

   Or use the command line:

   ```bash
   npx cap run ios
   ```

---

## 🤖 Run on Android

1. **Install Capacitor Android package:**

   ```bash
   npm install @capacitor/android
   ```

2. **Add the Android platform:**

   ```bash
   npx cap add android
   ```

3. **Open the project in Android Studio:**

   ```bash
   npx cap open android
   ```

4. **Run the project:**

   In Android Studio, select a virtual device or connect a physical device, then click the Run ▶️ button.

---

## 🔁 After Code Changes

Whenever you update web code (`src/`), make sure to copy the changes to native platforms:

```bash
npx cap copy
```

If you add plugins or make major config changes:

```bash
npx cap sync
```

---

## 🛠️ Troubleshooting

- Always ensure your platform SDKs (Xcode, Android SDK) are up to date.
- Run `ionic build` before `npx cap copy` to ensure the latest web code is built.
- Use `npx cap doctor` to check for common issues.

---
