;(function () {
  if (window.CapFlowFS) return

  function getApi() {
    const plugins = window.Capacitor && window.Capacitor.Plugins
    const fs = plugins && plugins.Filesystem
    if (!fs) throw new Error('Filesystem plugin not available')
    return fs
  }

  window.CapFlowFS = {
    readFile: async (options) => {
      const api = getApi()
      return await api.readFile(options)
    },
    writeFile: async (options) => {
      const api = getApi()
      return await api.writeFile(options)
    },
    appendFile: async (options) => {
      const api = getApi()
      return await api.appendFile(options)
    },
    mkdir: async (options) => {
      const api = getApi()
      return await api.mkdir(options)
    },
    readdir: async (options) => {
      const api = getApi()
      return await api.readdir(options)
    },
    stat: async (options) => {
      const api = getApi()
      return await api.stat(options)
    },
    deleteFile: async (options) => {
      const api = getApi()
      return await api.deleteFile(options)
    },
    rmdir: async (options) => {
      const api = getApi()
      return await api.rmdir(options)
    },
    rename: async (options) => {
      const api = getApi()
      return await api.rename(options)
    },
    copy: async (options) => {
      const api = getApi()
      return await api.copy(options)
    },
    getUri: async (options) => {
      const api = getApi()
      return await api.getUri(options)
    }
  }
})()
