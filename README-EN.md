[中文](./README.md)

# Image Compressor

A browser extension built with WXT and Vue 3 that provides efficient image compression capabilities.

## Features

- **Dual compression modes**
  - **Canvas Local Compression**: Processes images locally without network, protecting privacy
  - **TinyPNG API Compression**: Uses TinyPNG's professional service for higher compression rates

- **Convenient operations**
  - Drag-and-drop image upload
  - Right-click menu for quick compression of web images
  - Batch processing support
  - Batch download as a ZIP file

- **Compression options**
  - Adjust compression quality (0–100%)
  - Output format conversion (JPEG / PNG / WebP / keep original)
  - Image resizing with proportional scaling

- **Real-time preview**
  - Side-by-side before and after comparison
  - File size change statistics
  - Compression ratio display

## Supported Formats

- JPEG
- PNG
- WebP

## Installation

### Development

```bash
# install dependencies
pnpm install

# development mode (Chrome)
pnpm dev

# development mode (Firefox)
pnpm dev:firefox
```

### Building for Production

```bash
# build Chrome version
pnpm build

# build Firefox version
pnpm build:firefox

# package as ZIP
pnpm zip
```

## Usage

### Method 1: Drag and Drop

1. Click the extension icon in the browser toolbar
2. Drag images into the upload area
3. Choose compression mode and parameters
4. Click "Compress All" button
5. Download individually or as a packaged ZIP

### Method 2: Right-click Menu

1. Right-click any image on a web page
2. Select the "Compress Image" menu item
3. The extension popup will open and load the image
4. Compress and download

### Configure TinyPNG API

1. Visit the [TinyPNG Developer page](https://tinypng.com/developers) to get a free API key
2. Enter the API key in the extension's settings page and save
3. Switch to TinyPNG compression mode to use it

> TinyPNG free tier gives 500 compressions per month

## Tech Stack

- [WXT](https://wxt.dev/) - Modern browser extension framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation

## Project Structure

```
├── components/          # Vue components
│   ├── CompressionControls.vue  # Compression control panel
│   ├── DropZone.vue             # Drag-and-drop area
│   ├── ImageCard.vue            # Image card
│   ├── ImageList.vue            # Image list
│   ├── ModeToggle.vue           # Mode switch
│   ├── PreviewPanel.vue         # Preview panel
│   ├── ProgressBar.vue          # Progress bar
│   └── SizeStats.vue            # Size statistics
├── composables/         # Composables
│   ├── useCanvasCompressor.ts   # Canvas compression logic
│   ├── useCompression.ts        # Compression management
│   ├── useDragDrop.ts           # Drag-and-drop functionality
│   ├── useFileDownload.ts       # File download
│   ├── useSettings.ts           # Settings management
│   └── useTinyPng.ts            # TinyPNG API
├── entrypoints/         # Extension entry points
│   ├── background.ts            # Service Worker
│   ├── content.ts               # Content script
│   ├── options/                 # Options page
│   └── popup/                   # Popup page
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## Permissions

- `contextMenus` - create right-click menu
- `activeTab` - access current tab
- `storage` - store settings
- `host_permissions: api.tinify.com` - TinyPNG API requests

## Development

### Recommended IDE setup

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

### Type checking

```bash
pnpm compile
```

## License

MIT
