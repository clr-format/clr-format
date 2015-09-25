# Todo list

- `bugfix` - Move Format.Globalization.Numeric.IntlFormatter#applyCultureSpecificFormatting as part of info formatter in the core project.
Also remove Format.Utils.IntlResovlers#applyNumberCultureFormatting
- `feature` - Add configurable precision handler override for cases like `Math.round(1.005, 2) === 1` (already active for IE8's `toFixed`)
- `feature` - Add browser auto-detection of the current culture's code as part of clr-format-intl.js tear-down
- `feature` - Add parsing capabilities
- `enhancement` - Add description table for browser script files (x.js/d.ts -> does what)
- `enhancement` - Add *Advanced Usage* section in README and cleanup the rest of the sections where such examples are present
- `feature` - Add CLI node support
