# Todo list

- Move Format.Globalization.Numeric.IntlFormatter#applyCultureSpecificFormatting as part of info formatter in the core project.
Also remove Format.Utils.IntlResovlers#applyNumberCultureFormatting
- Create more tests for DateTimeFormatInfo and NumberFormatInfo objects
- Add configurable precision handler override for cases like `Math.round(1.005, 2) === 1` (already active for IE8's `toFixed`)
