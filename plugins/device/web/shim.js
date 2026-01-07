;(function () {
  if (!window.getDeviceInfo) {
    window.getDeviceInfo = async function () {
      const plugins = window.Capacitor && window.Capacitor.Plugins
      const device = plugins && plugins.Device
      if (!device) throw new Error('Device plugin not available')
      return await device.getInfo()
    }
  }

  if (!window.getDeviceId) {
    window.getDeviceId = async function () {
      const plugins = window.Capacitor && window.Capacitor.Plugins
      const device = plugins && plugins.Device
      if (!device || !device.getId) throw new Error('Device plugin not available')
      const res = await device.getId()
      return res && res.uuid
    }
  }
})()
