# Modern Huangli Android App

这个目录是微信小程序的 Android APK 复刻版。工程使用原生 Android WebView 加载本地 `assets`，运势算法、个人资料、月历和底部导航都在 APK 内离线运行。

## GitHub Actions 打包

把仓库上传到 GitHub 后，进入 Actions 页面运行 **Build Android APK**，或向 `main` / `master` 推送改动。构建完成后在 artifact 中下载 `huangli-android-app-version`，里面包含 `huangli-android-app.apk`。

## 本地构建

如果本地已安装 JDK 17、Android SDK 和 Gradle，可以在本项目根目录运行：

```bash
gradle assembleDebug
```

Gradle 默认输出位置：`app/build/outputs/apk/debug/app-debug.apk`。GitHub Actions 会自动复制并重命名为：`release/huangli-android-app.apk`。

## 目录说明

- `app/src/main/java`: Android 壳代码，负责启动 WebView。
- `app/src/main/assets`: 实际 App 页面、样式、运势算法和农历库。
- `.github/workflows/android-apk.yml`: GitHub Actions APK 构建流程。
