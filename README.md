[English](./README-EN.md)

# Image Compressor

一款基于 WXT + Vue 3 开发的浏览器扩展，提供高效的图片压缩功能。

## 功能特性

- **双模式压缩**
  - **Canvas 本地压缩**：无需联网，本地处理，保护隐私
  - **TinyPNG API 压缩**：使用 TinyPNG 专业压缩服务，压缩率更高

- **便捷操作**
  - 拖拽上传图片
  - 右键菜单快速压缩网页图片
  - 批量压缩处理
  - 批量下载为 ZIP 文件

- **压缩选项**
  - 调整压缩质量（0-100%）
  - 输出格式转换（JPEG / PNG / WebP / 保持原格式）
  - 图片尺寸调整（支持等比例缩放）

- **实时预览**
  - 压缩前后对比预览
  - 文件大小变化统计
  - 压缩比率显示

## 支持格式

- JPEG
- PNG
- WebP

## 安装

### 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式（Chrome）
pnpm dev

# 开发模式（Firefox）
pnpm dev:firefox
```

### 构建生产版本

```bash
# 构建 Chrome 版本
pnpm build

# 构建 Firefox 版本
pnpm build:firefox

# 打包为 ZIP
pnpm zip
```

## 使用方法

### 方式一：拖拽上传

1. 点击浏览器工具栏中的扩展图标
2. 将图片拖拽到上传区域
3. 选择压缩模式和参数
4. 点击「压缩全部」按钮
5. 单独下载或打包下载压缩后的图片

### 方式二：右键菜单

1. 在网页中右键点击任意图片
2. 选择「压缩图片」菜单项
3. 扩展弹窗将自动打开并加载图片
4. 压缩后下载

### 配置 TinyPNG API

1. 访问 [TinyPNG 开发者页面](https://tinypng.com/developers) 获取免费 API Key
2. 在扩展设置页面填入 API Key 并保存
3. 切换到 TinyPNG 压缩模式即可使用

> TinyPNG 免费版每月提供 500 次压缩额度

## 技术栈

- [WXT](https://wxt.dev/) - 现代化的浏览器扩展开发框架
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [JSZip](https://stuk.github.io/jszip/) - ZIP 文件生成

## 项目结构

```
├── components/          # Vue 组件
│   ├── CompressionControls.vue  # 压缩控制面板
│   ├── DropZone.vue             # 拖拽上传区域
│   ├── ImageCard.vue            # 图片卡片
│   ├── ImageList.vue            # 图片列表
│   ├── ModeToggle.vue           # 模式切换
│   ├── PreviewPanel.vue         # 预览面板
│   ├── ProgressBar.vue          # 进度条
│   └── SizeStats.vue            # 大小统计
├── composables/         # 组合式函数
│   ├── useCanvasCompressor.ts   # Canvas 压缩逻辑
│   ├── useCompression.ts        # 压缩管理
│   ├── useDragDrop.ts           # 拖拽功能
│   ├── useFileDownload.ts       # 文件下载
│   ├── useSettings.ts           # 设置管理
│   └── useTinyPng.ts            # TinyPNG API
├── entrypoints/         # 扩展入口
│   ├── background.ts            # Service Worker
│   ├── content.ts               # 内容脚本
│   ├── options/                 # 选项页
│   └── popup/                   # 弹窗页
├── types/               # TypeScript 类型定义
└── utils/               # 工具函数
```

## 权限说明

- `contextMenus` - 创建右键菜单
- `activeTab` - 访问当前标签页
- `storage` - 存储设置
- `host_permissions: api.tinify.com` - TinyPNG API 请求

## 开发

### 推荐 IDE 设置

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（禁用 Vetur）

### 类型检查

```bash
pnpm compile
```

## License

MIT
