# Memory Game

A browser-based two-player memory game built with TypeScript, SCSS and Vite. Players choose a starting color, a board size and one of two visual themes. Matching pairs score a point and the player with the highest score wins.

## Features

- Figma-inspired home and settings screens
- Two themes: Code Vibes and Foods
- Two players: Blue and Orange
- Three board sizes: 16, 24 and 36 cards
- Animated card flips
- Current-player indicator and live score
- Exit-game confirmation dialog
- Separate final-score and winner/draw screens
- TypeScript `MemoryCard` class

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`.

## Production build

```bash
npm run build
```

The production-ready files are generated inside the `dist` folder. Upload the contents of `dist` to the FTP server.
