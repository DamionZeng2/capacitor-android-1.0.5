# Capacitor Android Source

## 使用步骤
- Fork 本仓库到你的 GitHub 账户
- 在仓库 Settings → Secrets 添加：
  - ANDROID_KEYSTORE_BASE64
  - ANDROID_KEYSTORE_PASSWORD
  - ANDROID_KEY_ALIAS
  - ANDROID_KEY_ALIAS_PASSWORD
- 打开 Actions 选择 Android 构建工作流，填写：
  - app_name、bundle_id、website_url（可选）、capabilities（可选）
- 运行后在 Artifacts 与 Releases 获取 APK

## 说明
- 远程站点通过 capacitor.config.ts 的 server.url 配置
- 默认集成通用原生能力（无需填写 capabilities 也可使用）：
  - 设备信息、偏好存储、地理位置、相机、剪贴板、分享、浏览器、触感反馈、状态栏、闪屏
- 插件通过 capabilities（逗号分隔）安装，同时会注入到前端 `VITE_CAP_FEATURES`，用于额外扩展；模板代码不会静态引入未安装的插件
- 原生能力适配层在 `src/native.ts`，若安装了对应插件将优先走原生：
  - 指纹/生物识别：建议插件 `capacitor-native-biometric` 或 `@capawesome/capacitor-biometric`
  - 文件选择：建议插件 `@capawesome/capacitor-file-picker`
  - 在 `capabilities` 中填入对应 npm 包名以启用

## 插件选择与别名
- capabilities 支持输入 npm 包名或别名（逗号分隔），CI 会映射为可安装包：
  - biometric → @capawesome/capacitor-biometric
  - file-picker → @capawesome/capacitor-file-picker
  - camera → @capacitor/camera
  - geolocation/location → @capacitor/geolocation
  - clipboard → @capacitor/clipboard
  - device → @capacitor/device
  - dialog → @capacitor/dialog
  - preferences → @capacitor/preferences
  - share → @capacitor/share
  - browser → @capacitor/browser
  - haptics/vibrate → @capacitor/haptics
  - status-bar → @capacitor/status-bar
  - splash → @capacitor/splash-screen
