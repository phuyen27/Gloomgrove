# Khu Vườn Ma (Haunted Garden)

A pixel-art roguelite tower-defense game that runs straight in the browser. Plant seeds, keep the lanterns lit, and drive the ghosts back night after night. No install and no external libraries needed (the in-game text is Vietnamese).

## Play

Open `index.html` in a browser, or enable GitHub Pages for the repo (Settings → Pages → branch `main`, folder `/ (root)`).

- Tap the moonlight orbs falling from the sky to collect them.
- Pick a seed, then tap a grass cell to plant it. Keys `1`–`5` pick seeds quickly, `Space` pauses.
- Each row has one lantern that sweeps away every ghost in that row once. A ghost that gets past a used lantern ends the run.
- Survive a night to choose a blessing. If you lose, you earn souls to unlock new plants in the shop.

## Structure

```
.
├── index.html            # Page shell; script load order matters
├── css/style.css         # Canvas styles
├── assets/favicon.svg    # Tab icon
└── src/
    ├── main.js           # Entry point and main loop
    ├── core/             # config (size, palette), canvas + utils, save, state (runtime state)
    ├── data/             # plants, ghosts, perks, shop (add new content here)
    ├── gfx/              # kit (drawing toolkit), ghost / plant / prop sprites, cache + drawSpr
    ├── scene/            # static background, lighting, world drawing (plants, ghosts, lanterns, shots, particles)
    ├── game/             # run (run lifecycle), spawn, effects, planting, update, shop, demo
    ├── input/            # mouse, touch, keyboard
    ├── audio/            # procedural Web Audio: audio (sfx), music
    └── ui/               # widgets (panels, buttons), hud, screens (menu, shop, pause, ...)
```

The files are plain scripts (no ES modules) sharing globals, so opening `index.html` directly via `file://` still works.

## Adding content

- **New plant**: add a sprite to `BUILD` (`src/gfx/cache.js`), declare it in `PLANTS` (`src/data/plants.js`), and add its behaviour in `updatePlay` (`src/game/update.js`).
- **New ghost**: add a two-frame sprite `name_a` / `name_b`, declare it in `GHOSTS` (`src/data/ghosts.js`), and add it to `pickType` (`src/game/spawn.js`).
- **New blessing**: add an entry to `PERKS` (`src/data/perks.js`).

## Preview mode

Open `index.html?demo=play` (or `perk`, `over`, `shop`, `pause`) to jump straight to a screen for screenshots and testing.

## License

Pick a suitable license before going public (for example MIT).
