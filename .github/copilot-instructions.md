Copilot Instructions for Natura
---
# Copilot Instructions for Natura

## Project Overview
Minimal web app for a terminal-based survival/crafting game (Dr. Stone theme, inspired by "A Dark Room").
All gameplay is via a text-based terminal UI—no mouse interaction.

## Key Files
- `index.html`: Loads the app, references `script.js` and `style.css` only. No inline JS/CSS.
- `script.js`: All game logic (input, game loop, inventory, crafting, time, events).
- `style.css`: All styles, especially for the terminal interface.

## Architecture & Structure
- All code is in the root directory. No folders/modules.
- No frameworks, build tools, or external dependencies.
- Single-page web app. All logic in `script.js`, all styles in `style.css`.

## Developer Workflow
- Open `index.html` in a browser to run. No build/test/CI steps.

## Conventions & Patterns
- Use vanilla HTML, CSS, JS only.
- No inline JS/CSS in HTML.
- Reference scripts/styles with relative paths.
- Keep code modular and readable within single files.

## Visual Style
- The color scheme must be strictly monochrome: only black, white, and shades of gray are allowed.
- ONLY use the monospace font.
- Do not use any colors outside the grayscale spectrum in `style.css`.
- All UI elements, backgrounds, text, borders, and highlights should use only `#000`, `#fff`, or gray values (e.g., `#222`, `#ccc`).

## Game-Specific Guidelines
- Terminal UI for all input/output.
- Game loop, input handling, event management in `script.js`.
- Store/update player state (inventory, time, resources, etc.).
- Materials gathered via time/user commands.
- Crafting system: recipes require resources & time.
- Future: story progression, character system, crafting queue, upgrades, etc.

## Examples
- **Add a crafting command:**
  - Handle user input (e.g., `craft shelter`) in `script.js`.
  - Update resources, check requirements, respond in terminal.
  - Style terminal and output in `style.css`.
- **Add a resource command:**
  - "Add a command to gather stone. Print a response and update inventory."
- **Add a crafting system:**
  - "Craft tools using materials. Show requirements, check inventory, deduct resources."
- **Add a time system:**
  - "Make time pass every second; events like gathering/crafting take time."
- **Add a research system:**
  - "Unlock new tech when enough materials are gathered."
- **Add a terminal input:**
  - "Type commands like 'gather wood' or 'craft axe'."

## Guidance for AI Agents
- Stick to `script.js`, `style.css`, and `index.html` unless directed otherwise.
- **Do NOT** put JavaScript in the HTML file.
- **Do NOT** add libraries/build tools unless clearly requested—document changes here if you do.
- If adding complex features (saving, animations), keep them minimal and terminal-themed.

---
_Last updated: July 17, 2025_

    Include a crafting system with recipes that require specific resources and time to build.

    Future additions might include: story progression, character system, crafting queue, upgrades, etc.

Examples

    To add a crafting command:

        Handle the user input (like craft shelter) in script.js.

        Update the resource counts, check requirements, and respond in the terminal.

        Style the terminal window and output text in style.css.

Key Files

    index.html: Basic structure and entry point. Should load script.js and style.css only.

    script.js: Game logic, including player input, inventory, time management, and crafting.

    style.css: Styling for the terminal interface and other visuals.

Future Prompt Generator (for AI help)

Here are some future prompt templates you can use to ask for specific features. Keep your wording style:

    "Add a command to gather [resource]"
    Example: “Add a command to gather stone. I want it to print a response and update my inventory count.”

    "Make a crafting system"
    Example: “Add a crafting system where I can craft tools using materials. I want it to show requirements, check inventory, and then deduct resources.”

    "Create a time system"
    Example: “Make time pass every second and allow events like gathering or crafting to take time.”

    "Let me research stuff like in Dr. Stone"
    Example: “Add a research system where I unlock new tech when I gather enough materials.”

    "Make a terminal I can type into"
    Example: “Create a simple input terminal where I type commands like ‘gather wood’ or ‘craft axe’.”

Guidance for AI Agents

    Stick to script.js, style.css, and index.html unless directed otherwise.

    DO NOT put JavaScript in the HTML file.

    DO NOT add libraries or build tools unless clearly requested, and if so, document the changes here.

    If introducing complex features (like saving progress or animations), keep it in line with the minimal terminal theme.