import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: process.env.BUNDLE_ID || 'com.example.app',
  appName: process.env.APP_NAME || 'ExampleApp',
  webDir: 'dist',
  server: process.env.WEBSITE_URL
    ? { url: process.env.WEBSITE_URL, cleartext: true }
    : undefined
}

export default config
