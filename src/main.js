import { biometricVerify, pickFiles, isNative } from './native'

const root = document.getElementById('app')
root.textContent = 'Hello from Capacitor Android template'

async function demo() {
  const bio = await biometricVerify('登录验证')
  const files = await pickFiles('*/*', true)
  root.innerHTML = `
    <div>Native: ${isNative()}</div>
    <div>Biometric: ${bio}</div>
    <div>Files: ${files.length}</div>
  `
}
demo()
