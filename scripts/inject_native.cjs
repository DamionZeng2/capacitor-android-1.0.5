const fs = require('fs')
const path = require('path')

function parseFeatures() {
  const raw = (process.env.VITE_CAP_FEATURES || process.env.CAP_FEATURES || process.env.CAPABILITIES || '').trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function findFile(dir, name) {
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      const found = findFile(filePath, name)
      if (found) return found
    } else if (file === name) {
      return filePath
    }
  }
  return null
}

function buildInjectionJs(features) {
  const chunks = []
  for (const f of features) {
    const shimPath = path.resolve('plugins', f, 'web', 'shim.js')
    if (!fs.existsSync(shimPath)) continue
    const code = fs.readFileSync(shimPath, 'utf8').trim()
    if (code) chunks.push(code)
  }
  if (!chunks.length) return ''
  return `;(function(){\nif(window.__CapFlowInjected)return;\nwindow.__CapFlowInjected=true;\n${chunks.join('\n')}\n})();\n`
}

function writeAssetsInjection(js) {
  const assetsDir = path.resolve('android/app/src/main/assets')
  fs.mkdirSync(assetsDir, { recursive: true })
  fs.writeFileSync(path.join(assetsDir, 'injection.js'), js, 'utf8')
}

function patchMainActivity() {
  const mainActivityPath = findFile(path.resolve('android/app/src/main/java'), 'MainActivity.java')
  if (!mainActivityPath) {
    console.error('MainActivity.java not found')
    process.exit(1)
  }

  const content = fs.readFileSync(mainActivityPath, 'utf8')
  if (content.includes('capFlowInjectShim') || content.includes('injectShim')) {
    console.log('MainActivity already patched')
    return
  }

  const injectionCode = `
    @Override
    public void onStart() {
        super.onStart();
        capFlowInjectShim();
    }

    private void capFlowInjectShim() {
        android.webkit.WebView webView = this.bridge.getWebView();
        webView.setWebViewClient(new com.getcapacitor.BridgeWebViewClient(this.bridge) {
            @Override
            public void onPageFinished(android.webkit.WebView view, String url) {
                super.onPageFinished(view, url);
                try {
                    java.io.InputStream is = getAssets().open("injection.js");
                    int size = is.available();
                    byte[] buffer = new byte[size];
                    is.read(buffer);
                    is.close();
                    String js = new String(buffer, "UTF-8");
                    view.evaluateJavascript(js, null);
                } catch (Exception e) {
                    android.util.Log.e("CapacitorFlow", "Failed to inject shim", e);
                }
            }
        });
    }
`

  const lastBraceIndex = content.lastIndexOf('}')
  if (lastBraceIndex === -1) {
    console.error('MainActivity.java format not recognized')
    process.exit(1)
  }
  const newContent = content.slice(0, lastBraceIndex) + injectionCode + content.slice(lastBraceIndex)
  fs.writeFileSync(mainActivityPath, newContent, 'utf8')
  console.log('Injected shim logic into MainActivity.java')
}

const features = parseFeatures()
const injectionJs = buildInjectionJs(features)
if (!injectionJs) {
  console.log('No shims selected')
  process.exit(0)
}

writeAssetsInjection(injectionJs)
patchMainActivity()
