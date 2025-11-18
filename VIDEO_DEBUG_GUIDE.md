# Video Chat Debugging Guide

## Enhanced Logging System

I've added comprehensive logging throughout the video chat system to help diagnose camera/microphone permission issues.

## Log Prefixes

All video-related logs are prefixed with `[Video]` for easy filtering:
- `[Video]` - General video chat operations
- Console logs show successful operations
- Console errors show failures and detailed error information

## Key Log Points

### 1. **Initiating a Call**
When you click on a peer to start a video call:
```
[Video] Initiating call to peer: <peerId>
[Video] Requesting media access (audio: true, video: true)...
```

### 2. **Receiving a Call**
When someone calls you:
```
[Video] Being called by peer: <peerId>
[Video] Requesting media access (audio: true, video: true)...
```

### 3. **Successful Media Access**
```
[Video] Media access granted successfully
[Video] MediaStream tracks: [
  {kind: 'video', label: 'FaceTime HD Camera', enabled: true, readyState: 'live'},
  {kind: 'audio', label: 'MacBook Pro Microphone', enabled: true, readyState: 'live'}
]
```

### 4. **Permission Denied Errors**
When permissions are denied, you'll see detailed error information:
```
[Video] Error accessing media devices
[Video] Error name: NotAllowedError
[Video] Error message: Permission denied
[Video] Error stack: <full stack trace>
[Video] Full error object: <complete error details>
[Video] Permission was explicitly denied by user or system.
[Video] For Electron: Check System Preferences > Security & Privacy > Camera/Microphone
[Video] Ensure the app/Terminal has permissions enabled.
```

### 5. **Video Streaming**
When video starts streaming:
```
[Video] Starting to stream video from peer: <peerId>
[Video] Remote stream tracks: [...]
[Video] Remote video element srcObject set
[Video] Remote video playback started successfully
[Video] Showing local video preview
[Video] Local stream tracks: [...]
```

### 6. **Video Cleanup**
When closing video:
```
[Video] Closing video for peer: <peerId>
[Video] Stopping remote media tracks
[Video] Remote tracks to stop: [...]
[Video] Stopped remote track: video FaceTime HD Camera
[Video] Stopped remote track: audio MacBook Pro Microphone
[Video] Video cleanup completed for peer: <peerId>
```

## Error Types Explained

### NotAllowedError / PermissionDeniedError
- **Cause**: User or system explicitly denied camera/microphone access
- **Solution**: 
  - Check System Preferences > Security & Privacy > Camera
  - Check System Preferences > Security & Privacy > Microphone
  - Ensure Terminal or the Electron app is listed and checked
  - Restart the app after granting permissions

### NotFoundError / DevicesNotFoundError
- **Cause**: No camera or microphone detected
- **Solution**: Ensure devices are connected and recognized by the system

### NotReadableError / TrackStartError
- **Cause**: Device is in use by another application or hardware error
- **Solution**: 
  - Close other apps using camera/microphone (Zoom, Skype, etc.)
  - Restart the computer if issue persists

### OverconstrainedError / ConstraintNotSatisfiedError
- **Cause**: Requested media constraints cannot be satisfied
- **Solution**: Check if camera/microphone supports requested settings

### SecurityError
- **Cause**: HTTPS required or user gesture needed
- **Solution**: 
  - Use HTTPS for production
  - Use localhost for development
  - Ensure user clicked to initiate the call

## How to Debug

### 1. Open Developer Tools
When running electron:
```javascript
// In electron-main.js, uncomment this line:
mainWindow.webContents.openDevTools();
```

### 2. Filter Console Logs
In Chrome DevTools Console:
- Type `[Video]` in the filter box to see only video-related logs
- Look for red error messages

### 3. Check System Permissions

**macOS:**
```bash
# Check if Terminal has camera access
tccutil reset Camera
tccutil reset Microphone

# System Preferences > Security & Privacy > Privacy
# - Camera: Ensure Terminal or Electron is checked
# - Microphone: Ensure Terminal or Electron is checked
```

### 4. Check Available Devices
Run this in the browser console:
```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log('Available devices:', devices);
    devices.forEach(device => {
      console.log(device.kind + ': ' + device.label + ' id = ' + device.deviceId);
    });
  });
```

### 5. Test getUserMedia Directly
Run this in the browser console:
```javascript
navigator.mediaDevices.getUserMedia({audio: true, video: true})
  .then(stream => {
    console.log('SUCCESS! Got stream:', stream);
    console.log('Tracks:', stream.getTracks());
    // Stop the test stream
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error('FAILED:', err.name, err.message);
  });
```

## Common Issues and Solutions

### Issue: "getUserMedia is not supported"
**Symptoms:**
```
[Video] getUserMedia is not supported
[Video] navigator.mediaDevices: undefined
[Video] Current protocol: http:
```

**Solutions:**
- Use HTTPS in production
- Use localhost for development
- Check browser compatibility

### Issue: Permission Dialog Never Appears
**Solutions:**
1. Check if permissions were previously denied (look in browser settings)
2. Clear browser site data and try again
3. Check System Preferences if running Electron

### Issue: Black Video Screen
**Symptoms:**
- Video element appears but shows black screen
- No error in console

**Solutions:**
1. Check if tracks are enabled: `stream.getTracks().forEach(t => console.log(t.enabled))`
2. Verify track readyState: `stream.getTracks().forEach(t => console.log(t.readyState))`
3. Check CSS - ensure video element is visible and has dimensions

### Issue: "Device Already in Use"
**Symptoms:**
```
[Video] Error name: NotReadableError
[Video] Device is in use or hardware error occurred
```

**Solutions:**
1. Close other applications using camera/microphone
2. Stop previous streams before requesting new ones
3. Check for multiple tabs/windows using the devices

## Testing Steps

1. **Start the app:**
   ```bash
   npm run electron
   ```

2. **Open DevTools** (if enabled in electron-main.js)

3. **Filter console for `[Video]`**

4. **Try to initiate a video call**

5. **Check the console logs** - you should see step-by-step what's happening

6. **If error occurs**, read the error type and detailed logs

7. **Follow the specific solution** based on error type

## Additional Resources

- [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Chrome Media Capture](https://www.chromium.org/audio-video/)

## Contact
If issues persist after following this guide, provide:
1. Full console log (filtered by `[Video]`)
2. Operating system and version
3. Browser/Electron version
4. Steps to reproduce
