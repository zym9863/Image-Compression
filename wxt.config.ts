import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Image Compressor',
    description: '图片压缩工具 - 支持本地 Canvas 压缩和 TinyPNG API',
    version: '1.0.0',
    permissions: ['contextMenus', 'activeTab', 'storage'],
    host_permissions: ['https://api.tinify.com/*'],
  },
});
