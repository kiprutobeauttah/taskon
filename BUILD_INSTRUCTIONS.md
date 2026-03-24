# Building Beauttahs APK

## Prerequisites

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```

2. Login to Expo account (create one at https://expo.dev if needed):
```bash
eas login
```

## Build APK

### Option 1: Build with EAS (Recommended - Cloud Build)

1. **Configure the project:**
```bash
cd taskon
eas build:configure
```

2. **Build APK for Android:**
```bash
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo's servers
- Build the APK in the cloud
- Provide a download link when complete (usually 10-20 minutes)

3. **Download the APK:**
- Check the build status: `eas build:list`
- Download from the provided URL or Expo dashboard

### Option 2: Local Build (Requires Android Studio)

1. **Install Android Studio and SDK**
2. **Set up environment variables**
3. **Build locally:**
```bash
eas build --platform android --profile preview --local
```

## Build for Production

When ready for Google Play Store:

```bash
eas build --platform android --profile production
```

This creates an AAB (Android App Bundle) for Play Store submission.

## Quick Commands

```bash
# Check build status
eas build:list

# View specific build
eas build:view [BUILD_ID]

# Cancel a build
eas build:cancel

# Submit to Play Store (after production build)
eas submit --platform android
```

## Troubleshooting

### Build fails?
- Check `eas build:list` for error logs
- Ensure all dependencies are properly installed
- Verify app.json configuration

### Need to update the app?
1. Increment `version` in app.json
2. Increment `versionCode` in android section
3. Run build command again

## Testing the APK

1. Download the APK to your Android device
2. Enable "Install from Unknown Sources" in Settings
3. Open the APK file to install
4. Launch Beauttahs!

## App Details

- **App Name:** Beauttahs
- **Package:** com.beauttahs.app
- **Version:** 1.0.0
- **Version Code:** 1
