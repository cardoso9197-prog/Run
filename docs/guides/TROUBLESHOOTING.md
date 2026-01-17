# 🔧 APP TESTING TROUBLESHOOTING GUIDE
**Date:** December 17, 2025

---

## ❌ ERROR: "Element type is invalid"

### Problem:
```
Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: object.
```

### Cause:
- Import/Export mismatch in components
- Missing dependencies
- React Navigation configuration issue
- Cache corruption

### ✅ SOLUTIONS APPLIED:

#### 1. Added SafeAreaProvider
**File:** `passenger-app/App.js`
```javascript
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

#### 2. Cleared Metro Cache
```powershell
npx expo start --clear
```

---

## 🔍 OTHER COMMON ERRORS & FIXES

### Error: "Metro bundler failed to start"

**Fix 1: Clear all caches**
```powershell
cd passenger-app
npx expo start --clear
rm -rf node_modules
npm install
```

**Fix 2: Kill existing processes**
```powershell
Stop-Process -Name "node" -Force
npx expo start
```

### Error: "Unable to resolve module"

**Fix: Reinstall dependencies**
```powershell
cd passenger-app
rm -rf node_modules
rm package-lock.json
npm install
npx expo start
```

### Error: "Network response timed out"

**Fix: Check backend connection**
```powershell
# Start backend first
cd backend
npm start

# Then start app
cd ../passenger-app
npx expo start
```

### Error: "Location services not available"

**Fix: Enable permissions**
1. Go to phone Settings
2. Apps → Expo Go
3. Permissions → Location → Allow

### Error: "Map not loading"

**Fix: Check API keys and internet**
1. Verify internet connection
2. Check if using WiFi (not cellular)
3. Restart app

---

## 📱 TESTING BEST PRACTICES

### 1. Start Fresh
```powershell
# Kill all node processes
Stop-Process -Name "node" -Force

# Clear cache
cd passenger-app
npx expo start --clear
```

### 2. Check Dependencies
```powershell
# Update packages if needed
npx expo install --fix
```

### 3. Test on Physical Device
- Use real phone (not emulator) for GPS testing
- Ensure phone and computer on same WiFi

### 4. Monitor Logs
```powershell
# Watch for errors in terminal
# Look for red error messages
# Check warnings (yellow)
```

---

## 🎯 STEP-BY-STEP TESTING PROCESS

### Phase 1: App Loads
- [ ] Metro bundler starts
- [ ] QR code appears
- [ ] App downloads to phone
- [ ] Splash screen shows
- [ ] No red error screens

### Phase 2: Navigation Works
- [ ] Can navigate between screens
- [ ] Bottom tabs functional
- [ ] Stack navigation works
- [ ] Back button works

### Phase 3: Features Work
- [ ] Map loads
- [ ] GPS detects location
- [ ] Can drop pins
- [ ] Fare calculation works
- [ ] Can request ride

---

## 🛠️ ADVANCED DEBUGGING

### Enable React DevTools
```powershell
# In terminal while app running
Press 'j' to open Chrome debugger
```

### Check Network Requests
```javascript
// Add to any API call in code
console.log('API Request:', url, data);
console.log('API Response:', response);
```

### View AsyncStorage
```javascript
// Add to LoginScreen or HomeScreen
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getAllKeys().then(keys => {
  console.log('Storage Keys:', keys);
  AsyncStorage.multiGet(keys).then(items => {
    console.log('Storage Data:', items);
  });
});
```

---

## 📊 PERFORMANCE OPTIMIZATION

### If App is Slow:

**1. Reduce Map Markers**
```javascript
// Limit visible drivers to 10
const nearbyDrivers = allDrivers.slice(0, 10);
```

**2. Throttle Location Updates**
```javascript
// Update every 5 seconds instead of real-time
const locationOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 5000,
  distanceInterval: 10,
};
```

**3. Optimize Images**
- Use smaller image sizes
- Compress profile photos
- Lazy load images

---

## 🔄 COMPLETE RESET PROCEDURE

### If Nothing Works:

```powershell
# 1. Stop everything
Stop-Process -Name "node" -Force
Stop-Process -Name "expo" -Force

# 2. Clean passenger app
cd passenger-app
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install

# 3. Clean Metro cache
npx expo start --clear

# 4. On phone: Uninstall Expo Go, reinstall
# 5. Scan QR code again
```

---

## 📞 STILL HAVING ISSUES?

### Check These Files:

1. **passenger-app/App.js** - Main entry point
2. **passenger-app/src/navigation/AppNavigator.js** - Navigation setup
3. **passenger-app/src/context/AuthContext.js** - Authentication
4. **passenger-app/package.json** - Dependencies

### Common Fixes:

**Update Expo**
```powershell
npm install -g expo-cli
npx expo-cli upgrade
```

**Fix React Navigation**
```powershell
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
```

**Reinstall Everything**
```powershell
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

---

## ✅ SUCCESS INDICATORS

### App is Working When:

1. ✅ Metro bundler shows "Bundled successfully"
2. ✅ No red errors in terminal
3. ✅ App loads on phone without error screen
4. ✅ Can navigate between screens
5. ✅ Map displays with your location
6. ✅ Can interact with UI elements

### Current Status:
- **Cache:** ✅ Cleared
- **SafeAreaProvider:** ✅ Added
- **Dependencies:** ✅ Installed
- **Expo:** ✅ Running

---

## 📝 NOTES

- **Always clear cache** when making component changes
- **Test on real device** for accurate GPS
- **Keep phone and laptop on same WiFi**
- **Watch terminal** for error messages
- **Use Expo Go** for fastest testing

---

**Last Updated:** December 17, 2025  
**Status:** Troubleshooting in progress  
**App:** Run-Run Passenger App  
**Platform:** Expo / React Native
