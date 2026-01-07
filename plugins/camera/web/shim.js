;(function () {
  const nav = window.navigator || (window.navigator = {})
  if (nav.camera && nav.camera.getPicture) return
  nav.camera = nav.camera || {}
  nav.camera.getPicture = async function (options) {
    const plugins = window.Capacitor && window.Capacitor.Plugins
    const camera = plugins && plugins.Camera
    if (!camera) throw new Error('Camera plugin not available')
    const photo = await camera.getPhoto(Object.assign({ quality: 90, resultType: 'uri' }, options || {}))
    return photo && (photo.webPath || photo.path || photo.base64String || photo.dataUrl)
  }
})()
