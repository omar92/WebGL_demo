# WebGL Demo

A small WebGL project that renders an animated, rotating 3D cube with colored faces directly in the browser — no build tools or installation required.

## Demo

The scene displays a single cube that continuously rotates on two axes. Each face has a distinct color:

| Face   | Color  |
|--------|--------|
| Front  | White  |
| Back   | Red    |
| Top    | Green  |
| Bottom | Blue   |
| Right  | Yellow |
| Left   | Purple |

## File Structure

```
WebGL_demo/
├── Index.HTML   # Entry point — open this in a browser to run the demo
├── script.js    # WebGL rendering logic (shaders, buffers, animation loop)
└── gl-matrix.js # gl-matrix library for matrix/vector math
```

## How to Use

### Option 1 — Open directly in a browser

1. Clone or download this repository.
2. Open `Index.HTML` in any WebGL-capable browser (Chrome, Firefox, Edge, Safari).

```bash
git clone https://github.com/omar92/WebGL_demo.git
cd WebGL_demo
# Then open Index.HTML with your browser, e.g.:
open Index.HTML          # macOS
xdg-open Index.HTML      # Linux
start Index.HTML         # Windows
```

You should see a 640 × 480 canvas with a rotating colored cube.

### Option 2 — Serve with a local HTTP server

Some browsers restrict local file access. If the canvas appears blank, serve the files over HTTP instead:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then navigate to `http://localhost:8080` in your browser.

## Requirements

- A modern browser with WebGL support (Chrome 9+, Firefox 4+, Edge 12+, Safari 5.1+).
- No dependencies to install — `gl-matrix.js` is included in the repository and also loaded from the MDN CDN as a fallback in `Index.HTML`.

## How It Works

1. **Vertex shader** — transforms each vertex position using a projection matrix (camera) and a model-view matrix (world transform).
2. **Fragment shader** — interpolates and outputs the per-vertex color for every rendered pixel.
3. **Animation loop** — `requestAnimationFrame` increments `cubeRotation` each frame using elapsed time (`deltaTime`), keeping the rotation speed frame-rate independent.
