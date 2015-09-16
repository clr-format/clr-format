# [clr-format](https://github.com/clr-format/clr-format)
A lightweight, modular and stand-alone JavaScript implementation of a string formatting function that supports composite format strings, globalization and customization

[![Build Status](https://travis-ci.org/clr-format/clr-format.svg?branch=master)](https://travis-ci.org/clr-format/clr-format)
[![Dev Dependencies](https://david-dm.org/clr-format/clr-format/dev-status.svg)](https://david-dm.org/clr-format/clr-format/#info=devDependencies&view=table)

Installation
------------
The following commands can be used to install the script in a context of your choice.

#### [![NuGet](https://badge.fury.io/nu/clr-format.js.svg)](https://www.nuget.org/packages/clr-format.js)
`Install-Package clr-format.js`

#### [![Bower](https://badge.fury.io/bo/clr-format.svg)](http://bower.io/search/?q=clr-format)
`bower install clr-format`

#### [![NPM](https://badge.fury.io/js/clr-format.svg)](https://www.npmjs.com/package/clr-format)
`npm install clr-format`

Latest Version Capabilities
---------------------------

[![Sauce Test Status](https://saucelabs.com/browser-matrix/clr-format.svg)](https://saucelabs.com/u/clr-format)

1. Support for all of .NET's [standard][Standard Numeric Format Specifiers] and [custom][Custom Numeric Format String] numeric format strings (except for currency).
For lack of a better medium (other than MSDN) please refer to the [invariant test cases][formatInvariant_should.ts] for a more in-depth showcase of what can be expected as input/output.

    ```javascript
    expect(String.format("{0:P1}", -0.39678)).toBe("-39.7 %");
    expect(String.format("{0:#0.0E00}", 987654)).toBe("98.8E04");

    expect(String.format("{0:C}", 35.23)).toThrowError(Format.Errors.FormatError);
    ```

2. Optional globalization API contained in *clr-format-intl.js* that allows for culture-specific number and currency formatting via the [Format.setCulture] and [Format.setCurrency] methods.
You can find all MSDN-like examples compiled in the [culture-enabled test cases][formatCulture_should.ts].
Requires contextual support for the [ECMAScript Intl namespace]. For older browsers and cultures outside of "en-US" in Node.JS consider polyfilling with [Intl.js].

    ```javascript
    Format.setCulture("de-DE");
    expect(String.format("{0:N2}", -1234.56)).toBe("-1.234,56");
    expect(String.format("{0:#0.0#;(#0.0#,);-0-}", -1234.5)).toBe("(1,23)");

    Format.setCurrency("EUR");
    expect(String.format("{0:c}", 1230)).toBe("1.230,00 €");
    ```

3. Support for mixed index and alignment components.

    ```javascript
    expect(
        String.format(
            "Format primitives: {0}{5}, {4}, {3}, {1,-8},{2,4}",
            0, { "a": 1 }, [2], "3", true, undefined))
        .toBe("Format primitives: 0, true, 3, {\"a\":1} , [2]");
    ```

4. Optional configuration API contained in *clr-format-config.js* and defined under the [Format.Config] namespace.

    ```javascript
    Format.Config.addFormatToPrototype();
    expect("Format using the injected {0} method".format("prototype"))
        .toBe("Format using the injected prototype method");

    Format.Config.addToStringOverload();
    expect((1234.5678).toString("#,0.00")).toBe("1,234.57");
    ```

Usage
-----

#### As a browser script
```javascript
var formatted = String.format("Value: {0:00-00}", 345.6); // formatted = "Value: 03-46"
```

#### As a module
```javascript
var format = String.format = require("clr-format");

format.setCulture("en-US");
format.setCurrency("USD");

var formatted = String.format("Value: {0,-6:C}{1}", 1, "text"); // formatted = "Value: $1.00 text"

// Using the chainable configuration API
format.Config.addFormatToPrototype().addToStringOverload();
formatted = "Value:{0,10}".format("prototype"); // formatted = "Value: prototype"
formatted = (1234.5678).toString("D6"); // formatted = "001235"
```

API Documentation
-----------------
The [GitHub pages documentation] is generated from the latest release's source files. It includes the jsdoc comments and signatures of public/exported members,
as well as the declarations of private ones.

Do not rely on any privates; even though for classes they are technically exported they are most likely subject to change in the future.

Development
-----------
The implementation of this string formatting function is inspired by .NET's (and other Microsoft® products') [Composite Formatting] feature.
Therefore the final behaviour should be similar to what's described in the [Getting started with the String.Format method] article.
The main difference is that method names in JavaScript are intrinsically camelcase therefore [String.format] should be used instead.

To develop and contribute simply install NodeJS, clone the repository, install npm dependencies and run [Gulp].

#### Tools (download and install)
1. [GIT] - with the option to add `git` to PATH
2. [NodeJS] - with the option to add `node`, `npm`, and globally (`-g`) installed packages to PATH
3. [VSCode] - or any other IDE that has TypeScript language support

#### Building the project
```bash
git clone https://github.com/clr-format/clr-format.git
cd clr-format
npm install --ignore-scripts
npm install --global gulp
gulp
```

#### Notes
- The default gulp build tasks' list contains a [watch task][Gulp watch task]
which means it will block the console and continuously rebuild the project when files in the source or tests folder are changed.
- In VSCode pressing **Ctrl** + **Shift** + **B** or **T** will trigger the default build or test command respectively.
- The `--ignore-scripts` option is used to stop errors caused by `node-gyp` rebuild scripts introduced by `karma`.
Overall, it doesn't seem to affect this project's build.

Planned releases
----------------
##### 0.1 (Released)
Support for index and alignment components only; *without* any formatting rules specified by a provider or format string component.

##### 0.2 (Released)
Addition of a *clr-format-config.js* sub-module/package which can be optionally installed to compliment the core implementation with various pre-defined configurations.
See [Format.Config] for full documentation.

##### 0.3 (Released)
Implementation of an invariant number formatting provider and numeric format string components.

##### 0.4 (Released)
Addition of a *clr-format-intl.js* sub-module/package which can be optionally installed to provide globalization via a bridge to the [ECMAScript Intl namespace].

##### 0.5
Complete the implementation with a date formatting provider and date/time format string components.

[GIT]: http://git-scm.com/download/
[Gulp]: http://gulpjs.com/
[NodeJS]: https://nodejs.org/download/
[VSCode]: https://code.visualstudio.com/

[Composite Formatting]: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
[Custom Numeric Format String]: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx
[Standard Numeric Format Specifiers]: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
[Getting started with the String.Format method]: https://msdn.microsoft.com/en-us/library/system.string.format.aspx#Starting
[ECMAScript Intl namespace]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl
[Gulp watch task]: https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob-opts-cb
[Intl.js]: https://github.com/andyearnshaw/Intl.js

[GitHub pages documentation]: http://clr-format.github.io/clr-format
[Format.Config]: http://clr-format.github.io/clr-format/modules/format.config.html
[String.format]: http://clr-format.github.io/clr-format/interfaces/stringconstructor.html#format
[Format.setCulture]: http://clr-format.github.io/clr-format/modules/format.html#setculture
[Format.setCurrency]: http://clr-format.github.io/clr-format/modules/format.html#setcurrency

[formatInvariant_should.ts]: https://github.com/clr-format/clr-format/blob/master/test/core/String/formatInvariant_should.ts
[formatCulture_should.ts]: https://github.com/clr-format/clr-format/blob/master/test/core/String/formatCulture_should.ts#L33
