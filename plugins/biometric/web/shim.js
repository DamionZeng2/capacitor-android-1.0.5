;(function () {
  if (window.biometricAuth) return
  window.biometricAuth = async function (reason) {
    const plugins = window.Capacitor && window.Capacitor.Plugins
    const api = plugins && (plugins.Biometric || plugins.NativeBiometric)
    if (!api) throw new Error('Biometric plugin not available')
    if (api.isAvailable) {
      const available = await api.isAvailable().catch(() => ({ isAvailable: false }))
      if (available && available.isAvailable === false) throw new Error('Biometric not available')
    }
    if (api.verifyIdentity) return await api.verifyIdentity({ reason: reason || 'Authenticate' })
    if (api.verifyIdentityWithFallback) return await api.verifyIdentityWithFallback({ reason: reason || 'Authenticate' })
    return await api.verifyIdentity({ reason: reason || 'Authenticate' })
  }
})()
