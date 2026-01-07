function raw() {
  return (import.meta.env.VITE_CAP_FEATURES as string | undefined)?.toLowerCase() || ''
}
function includes(token: string) {
  return raw().split(',').map(s => s.trim()).filter(Boolean).some(s => s === token || s.includes(token))
}
export const FLAGS = {
  device: includes('device') || includes('@capacitor/device'),
  preferences: includes('preferences') || includes('@capacitor/preferences'),
  geolocation: includes('geolocation') || includes('location') || includes('@capacitor/geolocation'),
  camera: includes('camera') || includes('@capacitor/camera'),
  clipboard: includes('clipboard') || includes('@capacitor/clipboard'),
  browser: includes('browser') || includes('@capacitor/browser'),
  share: includes('share') || includes('@capacitor/share'),
  dialog: includes('dialog') || includes('@capacitor/dialog'),
  haptics: includes('haptics') || includes('vibrate') || includes('@capacitor/haptics'),
  statusBar: includes('status-bar') || includes('@capacitor/status-bar'),
  splash: includes('splash') || includes('@capacitor/splash-screen'),
  biometricCapawesome: includes('@capawesome/capacitor-biometric') || includes('biometric'),
  biometricNative: includes('capacitor-native-biometric'),
  filePickerCapawesome: includes('@capawesome/capacitor-file-picker') || includes('file-picker'),
  filePickerLegacy: includes('capacitor-file-picker')
}
