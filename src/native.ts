import { Capacitor } from '@capacitor/core'
import { FLAGS } from './config'

async function load(name: string) {
  try {
    const mod = await import(name)
    return mod
  } catch {
    return null
  }
}

export function isNative() {
  return Capacitor.isNativePlatform()
}

export async function getDeviceInfo() {
  if (FLAGS.device) {
    const mod = await load('@capacitor/device')
    return await mod?.Device?.getInfo()
  }
  const ua = navigator.userAgent || ''
  return { platform: 'web', osVersion: '', model: '', operatingSystem: ua }
}

export async function getDeviceId() {
  if (FLAGS.device) {
    const mod = await load('@capacitor/device')
    const id: any = await mod?.Device?.getId()
    if (id?.uuid) return id.uuid
  }
  const key = 'device_id'
  let val = localStorage.getItem(key)
  if (!val) {
    val = Math.random().toString(36).slice(2)
    localStorage.setItem(key, val)
  }
  return val
}

export async function setPreference(key: string, value: string) {
  if (FLAGS.preferences) {
    const mod = await load('@capacitor/preferences')
    return await mod?.Preferences?.set({ key, value })
  }
  localStorage.setItem(key, value)
}

export async function getPreference(key: string) {
  if (FLAGS.preferences) {
    const mod = await load('@capacitor/preferences')
    const res = await mod?.Preferences?.get({ key })
    if (res?.value !== undefined) return res.value
  }
  return localStorage.getItem(key) || null
}

export async function currentPosition() {
  if (FLAGS.geolocation) {
    const mod = await load('@capacitor/geolocation')
    return await mod?.Geolocation?.getCurrentPosition()
  }
  return await new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error('no geolocation'))
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export async function takePhoto(options: any = {}) {
  if (FLAGS.camera) {
    const mod = await load('@capacitor/camera')
    return await mod?.Camera?.getPhoto({ quality: 70, resultType: 'uri', ...options })
  }
  return await new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = () => {
      const file = input.files?.[0] || null
      resolve(file)
    }
    input.click()
  })
}

export async function copyToClipboard(text: string) {
  if (FLAGS.clipboard) {
    const mod = await load('@capacitor/clipboard')
    return await mod?.Clipboard?.write({ string: text })
  }
  await navigator.clipboard?.writeText(text)
}

export async function openUrl(url: string) {
  if (FLAGS.browser) {
    const mod = await load('@capacitor/browser')
    return await mod?.Browser?.open({ url })
  }
  window.open(url, '_blank')
}

export async function shareText(text: string, title?: string, url?: string) {
  if (FLAGS.share) {
    const mod = await load('@capacitor/share')
    return await mod?.Share?.share({ text, title, url })
  }
  if ((navigator as any).share) {
    await (navigator as any).share({ text, title, url })
  }
}

export async function showAlert(title: string, message: string) {
  if (FLAGS.dialog) {
    const mod = await load('@capacitor/dialog')
    return await mod?.Dialog?.alert({ title, message })
  }
  alert(`${title}\n${message}`)
}

export async function vibrate(duration = 50) {
  if (FLAGS.haptics) {
    const mod = await load('@capacitor/haptics')
    return await mod?.Haptics?.vibrate({ duration })
  }
}

export async function setStatusBarDark() {
  if (FLAGS.statusBar) {
    const mod = await load('@capacitor/status-bar')
    return await mod?.StatusBar?.setStyle({ style: 'DARK' as any })
  }
}

export async function hideSplash() {
  if (FLAGS.splash) {
    const mod = await load('@capacitor/splash-screen')
    return await mod?.SplashScreen?.hide()
  }
}

export async function biometricVerify(reason = 'Authenticate') {
  if (!isNative()) return false
  if (!(FLAGS.biometricCapawesome || FLAGS.biometricNative)) return false
  let api: any = null
  if (FLAGS.biometricCapawesome) {
    const mod = await load('@capawesome/capacitor-biometric')
    api = mod?.Biometric
  } else if (FLAGS.biometricNative) {
    const mod = await load('capacitor-native-biometric')
    api = mod?.NativeBiometric
  }
  if (!api) return false
  const available = await api.isAvailable().catch(() => ({ isAvailable: false }))
  if (!available?.isAvailable) return false
  try {
    await api.verifyIdentity({ reason })
    return true
  } catch {
    return false
  }
}

export async function pickFiles(accept?: string, multiple = false) {
  if (FLAGS.filePickerCapawesome) {
    const mod = await load('@capawesome/capacitor-file-picker')
    const res = await mod?.FilePicker?.pickFiles({ types: accept ? [accept] : undefined, multiple })
    return (res?.files ?? []).map((f: any) => ({ name: f.name, mimeType: f.mimeType, path: f.path, blob: f.blob }))
  } else if (FLAGS.filePickerLegacy) {
    const picker = await load('capacitor-file-picker')
    if (picker?.FilePicker) {
      const res = await picker.FilePicker.pickFiles({ types: accept ? [accept] : undefined, multiple })
      return (res?.files ?? []).map((f: any) => ({ name: f.name, mimeType: f.mimeType, path: f.path, blob: f.blob }))
    }
  }
  return await htmlInputFallback(accept, multiple)
}

async function htmlInputFallback(accept?: string, multiple = false) {
  return new Promise<File[]>((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple
    if (accept) input.accept = accept
    input.onchange = () => {
      const files = Array.from(input.files || [])
      resolve(files)
    }
    input.click()
  })
}
