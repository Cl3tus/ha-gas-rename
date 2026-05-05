# HA-Gas-Rename

A Home Assistant dashboard resource that renames **"Gas"** to **"Stadsverwarming"** (NL) or **"District Heating"** (EN) throughout the Energy dashboard UI — including the tabs, charts, and the Now view.

## Why

Home Assistant's Energy dashboard hardcodes the word "Gas" in its frontend. This script patches the rendered DOM in real-time to replace those labels with the correct terminology for district heating systems.

## What it changes

| Original (NL)     | Replaced with             |
|-------------------|---------------------------|
| Gas               | Stadsverwarming           |
| Gasverbruik       | Stadsverwarming Verbruik  |
| Gasdoorstroom     | Stadsverwarming Doorstroom|
| Gas total         | Stadsverwarming Totaal    |
| Gas consumption   | Stadsverwarming Verbruik  |

| Original (EN)     | Replaced with                    |
|-------------------|----------------------------------|
| Gas               | District Heating                 |
| Gas consumption   | District Heating consumption     |
| Gas total         | District Heating total           |
| Gas flow rate     | District Heating flow rate       |

Language is auto-detected from the browser's `<html lang="">` attribute.

## Installation

### Option A — Dashboard Resource (recommended, no files needed)

1. Go to **Settings → Dashboards → Resources**
2. Click **Add Resource**
3. Paste the contents of `gas-rename.js` as an inline module, or host the file at `/config/www/gas-rename.js` and use the URL `/local/gas-rename.js`
4. Set type to **JavaScript Module**
5. Hard refresh your browser (Ctrl+Shift+R)

### Option B — Via /config/www/

1. Copy `gas-rename.js` to `/config/www/gas-rename.js`
2. Go to **Settings → Dashboards → Resources**
3. Add resource URL: `/local/gas-rename.js` (type: JavaScript Module)
4. Hard refresh your browser (Ctrl+Shift+R)

## How it works

- Uses a `MutationObserver` to watch for DOM changes (debounced at 300ms)
- Patches `Element.prototype.attachShadow` to intercept new Lit shadow roots before they render
- Traverses all shadow DOMs recursively using `TreeWalker` for efficient text node access
- Runs additional passes at 200ms, 800ms, and 2000ms after page load to catch lazy-rendered content

## Notes

- Only affects the visual labels — no entities, sensors, or HA configuration is modified
- Works on all pages but only has visible effect where "Gas" appears (Energy dashboard)
- Compatible with both Dutch and English HA frontend languages
