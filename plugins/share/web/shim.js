;(function () {
  const nav = window.navigator || (window.navigator = {})
  if (nav.share) return
  nav.share = async function (data) {
    const plugins = window.Capacitor && window.Capacitor.Plugins
    const share = plugins && plugins.Share
    if (!share) throw new Error('Share plugin not available')
    await share.share(data || {})
  }
})()
