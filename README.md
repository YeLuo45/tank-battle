# 坦克大作战 - Web + PWA 游戏

A classic tank battle game built with React 18, Vite 5, and Canvas 2D.

## Features

- 13x13 grid-based top-down tank combat
- Player tank: WASD/Arrow keys to move, SPACE to shoot
- 4-direction movement with 3 lives
- Obstacles: Brick (destructible), Steel (indestructible), Grass (stealth), River (impassable)
- Enemy AI: Patrol + Chase behavior, 2-4 tanks per wave
- Base defense: Protect the eagle in the bottom-right corner
- 3-minute countdown timer
- Score system with localStorage high score
- PWA installable on desktop and mobile

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Canvas 2D
- vite-plugin-pwa

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deployed to GitHub Pages: https://yeluo45.github.io/tank-battle/

## Game Controls

- W / Arrow Up - Move Up
- A / Arrow Left - Move Left
- S / Arrow Down - Move Down
- D / Arrow Right - Move Right
- SPACE - Shoot

## Game Rules

1. Destroy enemy tanks to earn points (100 pts each)
2. Wave bonus increases with each wave cleared
3. Protect your base (eagle icon) in the bottom-right
4. Game ends when: lives reach 0, base is destroyed, or time runs out
5. Hidden in grass to evade enemies
