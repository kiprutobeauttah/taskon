@echo off
echo ========================================
echo Beauttahs APK Build Script
echo ========================================
echo.

echo Step 1: Installing EAS CLI...
call npm install -g eas-cli
echo.

echo Step 2: Logging into Expo...
call eas login
echo.

echo Step 3: Configuring EAS Build...
call eas build:configure
echo.

echo Step 4: Building APK...
echo This will take 10-20 minutes...
call eas build --platform android --profile preview
echo.

echo ========================================
echo Build complete!
echo Check the URL above to download your APK
echo ========================================
pause
