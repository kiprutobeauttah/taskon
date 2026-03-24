# 🚀 Build Beauttahs APK - Quick Start

## Step 1: Login to Expo (One-time setup)

Open a new terminal in the `taskon` folder and run:

```bash
eas login
```

**Don't have an Expo account?**
- Go to https://expo.dev/signup
- Create a free account (takes 30 seconds)
- Come back and run `eas login`

## Step 2: Build the APK

After logging in, run:

```bash
eas build --platform android --profile preview
```

**What happens next:**
1. ✅ EAS will ask a few questions (just press Enter for defaults)
2. ✅ Your code uploads to Expo's servers (~1 minute)
3. ✅ Build starts in the cloud (10-20 minutes)
4. ✅ You'll get a download link when done!

## Step 3: Download & Install

1. Click the download link from the terminal
2. Transfer the APK to your Android phone
3. Install it (you may need to enable "Install from Unknown Sources")
4. Launch Beauttahs! 🎉

---

## Alternative: Check Build Status

If you close the terminal, you can check your build status:

```bash
eas build:list
```

Or visit: https://expo.dev/accounts/[your-username]/projects/beauttahs/builds

---

## Need Help?

**Build failed?**
- Run: `eas build:list` to see error details
- Check that all files are saved
- Try again with the same command

**Want to rebuild?**
- Just run the build command again
- Each build gets a unique ID

---

## 🎯 Quick Commands Reference

```bash
# Login (first time only)
eas login

# Build APK
eas build --platform android --profile preview

# Check builds
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

---

## Ready? Let's Go! 🚀

1. Open terminal in `taskon` folder
2. Run: `eas login`
3. Run: `eas build --platform android --profile preview`
4. Wait for the magic to happen!

Your APK will be ready in about 15-20 minutes. ⏱️
