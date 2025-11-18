# Quick Reference - Video Chat Debugging

## 🔍 How to See Logs

### Enable DevTools
In `electron-main.js` line 73, uncomment:
```javascript
mainWindow.webContents.openDevTools();
```

### Filter Logs
In DevTools Console, type: `[Video]`

## 📋 Common Error Types

| Error Name | Meaning | Quick Fix |
|------------|---------|-----------|
| `NotAllowedError` | Permission denied | System Preferences → Security & Privacy → Camera/Microphone |
| `NotFoundError` | Device not found | Check if camera/mic is connected |
| `NotReadableError` | Device in use | Close Zoom, Skype, or other apps |
| `SecurityError` | HTTPS required | Use localhost or HTTPS |
| `OverconstrainedError` | Settings issue | Check device compatibility |

## ⚡ Quick Debug Commands

### In Browser Console:

**List all media devices:**
```javascript
navigator.mediaDevices.enumerateDevices().then(d => console.table(d))
```

**Test camera/mic access:**
```javascript
navigator.mediaDevices.getUserMedia({audio: true, video: true})
  .then(s => { console.log('✓ Success!', s.getTracks()); s.getTracks().forEach(t => t.stop()); })
  .catch(e => console.error('✗ Failed:', e.name, e.message))
```

**Check current permissions:**
```javascript
navigator.permissions.query({name: 'camera'}).then(p => console.log('Camera:', p.state))
navigator.permissions.query({name: 'microphone'}).then(p => console.log('Mic:', p.state))
```

## 🔧 macOS System Check

### Terminal Commands:
```bash
# Reset permissions (requires user approval again)
tccutil reset Camera
tccutil reset Microphone

# Check system log for permission issues
log show --predicate 'subsystem == "com.apple.TCC"' --info --last 1h
```

### Manual Check:
1. Open **System Preferences**
2. Go to **Security & Privacy**
3. Click **Privacy** tab
4. Check **Camera** - ensure Terminal or Electron is ✓
5. Check **Microphone** - ensure Terminal or Electron is ✓

## 📊 Log Examples

### ✅ Success:
```
[Video] Initiating call to peer: abc123
[Video] Requesting media access (audio: true, video: true)...
[Video] Media access granted successfully
[Video] MediaStream tracks: [
  {kind: 'video', label: 'FaceTime HD Camera', enabled: true, readyState: 'live'},
  {kind: 'audio', label: 'MacBook Pro Microphone', enabled: true, readyState: 'live'}
]
```

### ❌ Permission Denied:
```
[Video] Initiating call to peer: abc123
[Video] Requesting media access (audio: true, video: true)...
[Video] Error name: NotAllowedError
[Video] Error message: Permission denied
[Video] Permission was explicitly denied by user or system.
[Video] For Electron: Check System Preferences > Security & Privacy > Camera/Microphone
```

### ⚠️ Device In Use:
```
[Video] Error name: NotReadableError
[Video] Device is in use or hardware error occurred.
```

## 🚀 Quick Start

```bash
# 1. Build the app
npm run build

# 2. Run electron
npm run electron

# 3. Open DevTools (if enabled)
# 4. Filter console by: [Video]
# 5. Try video chat
# 6. Check logs for any issues
```

## 📝 What Gets Logged

✓ Call initiation  
✓ Permission requests  
✓ Permission grants/denials  
✓ Device information  
✓ Stream tracks  
✓ Video playback  
✓ Error details (name, message, stack)  
✓ Video cleanup  

## 🆘 Still Having Issues?

1. Check `VIDEO_DEBUG_GUIDE.md` for detailed information
2. Review console logs with `[Video]` filter
3. Verify System Preferences permissions
4. Try resetting permissions with `tccutil reset Camera`
5. Restart the app after granting permissions

## 📚 Documentation Files

- `CAMERA_FIX.md` - Initial fix overview
- `VIDEO_DEBUG_GUIDE.md` - Comprehensive debugging guide
- `LOGGING_CHANGES_SUMMARY.md` - Complete change log
- `QUICK_REFERENCE.md` - This file
