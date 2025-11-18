# Camera/Microphone Permission Fix for Electron

## Changes Made

### 1. Updated `electron-main.js`
- Added comprehensive permission handlers for media access
- Implemented `setPermissionRequestHandler` to allow media permissions
- Added `setPermissionCheckHandler` for runtime permission checks
- Added `setDevicePermissionHandler` specifically for video/audio input devices

### 2. Updated `package.json`
- Added macOS entitlements configuration in the build section
- References the new `entitlements.mac.plist` file

### 3. Created `entitlements.mac.plist`
- New file that declares the app's need for camera and microphone access
- Includes proper entitlements for:
  - `com.apple.security.device.camera` - Camera access
  - `com.apple.security.device.audio-input` - Microphone access
  - Network client/server permissions for PeerJS
  - Required security exceptions for Electron

## How to Use

### For Development (Running with `npm run electron`):
1. The code changes in `electron-main.js` will take effect immediately
2. Run: `npm run electron`
3. macOS will prompt you to grant camera/microphone permissions when first accessed
4. Go to **System Preferences > Security & Privacy > Privacy** and ensure Electron/Terminal has camera/microphone access

### For Production (Building the App):
1. Build the app: `npm run package-mac`
2. The built app will include the entitlements
3. When users first launch the app and try to use video chat, macOS will show a permission dialog
4. Users must approve camera/microphone access

## Testing
1. Clean rebuild: `npm run build`
2. Run electron: `npm run electron`
3. Test the video chat feature
4. If permissions are still denied, check System Preferences

## Troubleshooting

### If permissions still don't work:
1. Check System Preferences > Security & Privacy > Camera and Microphone
2. Ensure your Terminal app (or the app running Electron) is listed and checked
3. Try resetting permissions:
   ```bash
   tccutil reset Camera
   tccutil reset Microphone
   ```
4. Restart the Electron app

### For packaged apps:
- The entitlements are only applied when building with `electron-builder`
- Development mode (npm run electron) relies on Terminal's permissions
- Make sure to sign your app properly for distribution

## Notes
- The permission handlers now support multiple permission types
- All media-related permissions are automatically granted
- The device permission handler specifically allows video and audio input devices
- Network permissions are included for PeerJS functionality
