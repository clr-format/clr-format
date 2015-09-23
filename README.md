# [clr-format](https://github.com/clr-format/clr-format)
A lightweight, modular and stand-alone JavaScript implementation of a string formatting function that fully supports [composite formatting][Composite Formatting], globalization and customization

[![Build Status](https://travis-ci.org/clr-format/clr-format.svg?branch=master)](https://travis-ci.org/clr-format/clr-format)
[![Dev Dependencies](https://david-dm.org/clr-format/clr-format/dev-status.svg)](https://david-dm.org/clr-format/clr-format/#info=devDependencies&view=table)

- [Usage](#usage)
- [Capabilities](#latest-version-capabilities)
- [Documentation][String.format]
- [Development](#development)
- [Roadmap](#planned-releases)


Installation
------------
The following commands can be used to install the script from your favorite package manager.

#### [![NuGet](https://badge.fury.io/nu/clr-format.js.svg)](https://www.nuget.org/packages/clr-format.js)
`Install-Package clr-format.js`

#### [![Bower](https://badge.fury.io/bo/clr-format.svg)](http://bower.io/search/?q=clr-format)
`bower install clr-format`

#### [![NPM](https://badge.fury.io/js/clr-format.svg)](https://www.npmjs.com/package/clr-format)
`npm install clr-format`


Usage
-----

### As a browser script
Include the *clr-format.js* script (and optionally the *config* and/or *intl* sub-modules).
**Only** the [Format] namesace will ever be added as a global object and, of course, the declaration for the [String.format] method.
```javascript
var formatted = String.format("Value: {0:00-00}", 345.6); // formatted = "Value: 03-46"

var culture = new Format.Globalization.CultureInfo("en-US"); // or use Format.setCulture, requires the intl sub-module

formatted = String.format(culture, "Value: {0:Y}", new Date(2015, 8)); // formatted = "Value: September 2015"
```

### As a module
`require` returns the formatting method which should be assigned to `String.format` for clarity. The returned object also has properties that expose the *config* and *intl* sub-module implementations.
```javascript
var format = String.format = require("clr-format");

format.setCulture("en-US");
format.setCurrency("USD");

var formatted = String.format("Value: {0,-6:C}{1}", 1, "text"); // formatted = "Value: $1.00 text"

// Using the chainable configuration API
format.Config.addFormatToPrototype().addToStringOverload();
formatted = "Value:{0,10}".format("prototype"); // formatted = "Value: prototype"
formatted = new Date("T23:12:32").toString("Value\: hh:mm:ss tt"); // formatted = "Value: 11:12:32 PM"
```


Latest Version Capabilities
---------------------------

[![Sauce Test Status](https://saucelabs.com/browser-matrix/clr-format.svg)](https://saucelabs.com/u/clr-format)

1. *Core* implentation of index and alignment components' replacement.

    ```javascript
    expect(
        String.format(
            "Format primitives: {0}{5}, {4}, {3}, {1,-8},{2,4}",
            0, { "a": 1 }, [2], "3", true, undefined))
        .toBe("Format primitives: 0, true, 3, {\"a\":1} , [2]");
    ```

2. *Core* culture-invariant support for all of .NET's [standard numeric][Standard Numeric Format Specifiers] and [custom numeric][Custom Numeric Format String] format strings (except for currency),
as well as all [standard date/time][Standard Date Time Format Specifiers] and [custom date/time][Custom Date Time Format String] specifiers.
For lack of a better medium (other than MSDN) please refer to the [invariant test cases][formatInvariant_should.ts] for a more in-depth showcase of what can be expected as input/output.

    ```javascript
    expect(String.format("{0:P1}", -0.39678)).toBe("-39.7 %");
    expect(String.format("{0:#0.0E00}", 987654)).toBe("98.8E04");

    expect(String.format("{0:C}", 35.23)).toThrowError(Format.Errors.FormatError);

    expect(String.format("{0:F}", new Date(2015, 8, 21, 13, 4, 55)))
        .toBe("Monday, 21 September 2015 13:04:55");
    ```

3. *Optional* browser globalization API contained in *clr-format-intl.js* that allows for culture-specific number and currency formatting via the [Format.setCulture] and [Format.setCurrency] methods.
You can find all MSDN-like examples compiled in the [culture-specific test cases][formatCulture_should.ts].
**Requires** contextual support for the [ECMAScript Intl namespace]. For older browsers and cultures outside of `"en-US"` in NodeJS consider polyfilling with [Intl.js].

    ```javascript
    Format.setCulture("de-DE");
    expect(String.format("{0:N2}", -1234.56)).toBe("-1.234,56");
    expect(String.format("{0:#0.0#;(#0.0#,);-0-}", -1234.5)).toBe("(1,23)");

    Format.setCurrency("EUR");
    expect(String.format("{0:c}", 1230)).toBe("1.230,00 €");

    expect(String.format("{0:D}", new Date(2015, 8, 21, 13, 4, 55)))
        .toBe("Montag, 21. September 2015");
    ```

4. *Optional* browser configuration API contained in *clr-format-config.js* and defined under the [Format.Config] namespace.

    ```javascript
    Format.Config.addFormatToPrototype();
    expect("Format using the injected {0} method".format("prototype"))
        .toBe("Format using the injected prototype method");

    Format.Config.addToStringOverload();
    expect((1234.5678).toString("#,0.00")).toBe("1,234.57");
    expect(new Date().toString("dd/MM/yyyy")).toBe("16/09/2015");
    ```

#### Note
All optional browser APIs are included inside the NodeJS package with slightly different usage than on browsers. See the [Usage](#usage) section for details.

API Documentation
-----------------
The [GitHub pages documentation] is generated from the latest release's source files. It includes the jsdoc comments and signatures of public/exported members,
as well as the declarations of private ones.

Do not rely on any privates; even though for classes and some modules they are technically exported they are most likely subject to change in the future.


Development
-----------
The implementation of this string formatting function is inspired by .NET's (and other Microsoft® products') [Composite Formatting] feature.
Therefore the behaviour and method signatures match what's described in the [Getting started with the String.Format method] article as closely as possible.
The main difference is that method names in JavaScript are intrinsically camelcase therefore [String.format] is used instead.

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

##### 0.5 (Released)
Complete the implementation with a date formatting provider and date/time format string components.

##### 0.6
Cleanup, bugfixing and refinement of the existing implementation while maintaining the current API.

[GIT]: http://git-scm.com/download/
[Gulp]: http://gulpjs.com/
[NodeJS]: https://nodejs.org/download/
[VSCode]: https://code.visualstudio.com/

[Composite Formatting]: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
[Custom Numeric Format String]: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx
[Custom Date Time Format String]: https://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx
[Standard Numeric Format Specifiers]: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
[Standard Date Time Format Specifiers]: https://msdn.microsoft.com/en-us/library/az4se3k1.aspx
[Getting started with the String.Format method]: https://msdn.microsoft.com/en-us/library/system.string.format.aspx#Starting
[ECMAScript Intl namespace]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl
[Gulp watch task]: https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob-opts-cb
[Intl.js]: https://github.com/andyearnshaw/Intl.js

[GitHub pages documentation]: http://clr-format.github.io/clr-format
[Format]: http://clr-format.github.io/clr-format/modules/format
[Format.Config]: http://clr-format.github.io/clr-format/modules/format.config.html
[String.format]: http://clr-format.github.io/clr-format/interfaces/stringconstructor.html#format
[Format.setCulture]: http://clr-format.github.io/clr-format/modules/format.html#setculture
[Format.setCurrency]: http://clr-format.github.io/clr-format/modules/format.html#setcurrency

[formatInvariant_should.ts]: https://github.com/clr-format/clr-format/blob/master/test/core/String/formatInvariant_should.ts#L14
[formatCulture_should.ts]: https://github.com/clr-format/clr-format/blob/master/test/core/String/formatCulture_should.ts#L33
