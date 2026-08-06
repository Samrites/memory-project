# Memory Game

A two-player browser Memory game built with TypeScript, SCSS and Vite. Players choose a starting player, a board size and one of two visual themes. Matching pairs score one point; the player with the highest score wins.

## Features

- Figma-based landing and settings screens
- Code Vibes and Foods themes
- Blue and Orange players
- 16, 24 and 36-card boards
- Animated 3D card flips
- Current-player indicator and live score
- Exit confirmation that returns to Settings
- Separate final-score and winner/draw screens
- `MemoryCard` TypeScript class

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173/`.

## Production build

```bash
npm run build
```

Upload the contents of `dist` to the FTP server. The Vite configuration uses relative paths, so the build can run inside a subfolder.
