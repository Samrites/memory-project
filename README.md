# Memory Game

A two-player memory game with configurable player color, board size and card theme.

## Features

- Two themes: Code Vibes and Foods
- Three board sizes: 16, 24 and 36 cards
- Two-player score and current-player display
- Animated card flips, exit dialog and game-over screen
- Settings are retained when returning from the game

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Project structure

- `src/app`: shared settings, routing and game-result state
- `src/pages`: page templates and page behavior
- `src/styles`: SCSS organized by purpose
- `puplic`: design and card assets supplied for the project

## Before submitting

Check every screen against the provided Figma design, including colors, fonts,
spacing and hover states. Commit each completed, understood change separately.
