# [clr-format](https://github.com/clr-format/clr-format)
A lightweight, modular JavaScript implementation of a string formatting function that supports composite format strings and globalization

Installation
------------
The following commands can be used to install the script in a context of your choice.

#### NuGet ([gallery link](https://www.nuget.org/packages/clr-format.js))
    Install-Package clr-format.js

#### Bower
    bower install clr-format

#### Module
    npm install clr-format

Latest Version Capabilities
---------------------------

1. Full support for index \{__0__\} and alignment \{0,__-10__\} components.
    ```javascript
    expect(
        String.format(
            "Format primitives: {0}{5}, {4}, {3}, {1,-8},{2,4}",
            0, { "a": 1 }, [2], "3", true, undefined))
        .toBe("Format primitives: 0, true, 3, {\"a\":1} , [2]");
    ```

2. Providing a format string \{0,-10:__0.00__\} component will result in a thrown [FormatError](http://clr-format.github.io/clr-format/classes/format.errors.formaterror.html).
    ```javascript
    expect(
        String.format(
            "{0:00.0}", 1))
        .toThrowError(Format.Errors.FormatError);
    ```

3. Optional configuration API contained in *clr-format-config.js* and defined under the [Format.Config](http://clr-format.github.io/clr-format/modules/format.config.html) namespace.
The example differs a bit when used as a NodeJS module, see in the Usage section below.
    ```javascript
    Format.Config.addFormatToPrototype();
    expect("Formatting using the injected {0} method".format("prototype"))
        .toBe("Formatting using the injected prototype method");
    ```

Usage
-----

#### As a browser script
```javascript
var formatted = String.format("Value: {0}{1,5}", 1, "text"); // formatted = "Value: 1 text"
```

#### As a module
```javascript
var format = require("clr-format");
var formatted = format("Value: {0,-2}{1}", 1, "text"); // formatted = "Value: 1 text"

// Using the configuration API
format.Config.addFormatToPrototype();
formatted = "Value: {0}".format("prototype"); // formatted = "Value: prototype"
```

Development
-----------
The implementation of this string formatting function is inspired by .NET's (and other Microsoft® products') [Composite Formatting](https://msdn.microsoft.com/en-us/library/txafckwd.aspx) feature.
Therefore the final behaviour should be similar to what's described in the [Getting started with the String.Format method](https://msdn.microsoft.com/en-us/library/system.string.format.aspx#Starting) article.
The main difference is that method names in JavaScript are intrinsically camelcase therefore [String.format](http://clr-format.github.io/clr-format/interfaces/stringconstructor.html#format) should be used instead.

To develop and contribute simply install NodeJS, clone the repository, install npm dependencies and run [Gulp](http://gulpjs.com/).

#### Tools (download and install)
1. [GIT](http://git-scm.com/download/)
2. [NodeJS](https://nodejs.org/download/) - make sure to keep the option to add node and globally installed packages to PATH
3. [VSCode](https://code.visualstudio.com/) - or any other IDE that has TypeScript language support

#### Building the project
```bash
git clone https://github.com/clr-format/clr-format.git
npm install --global gulp
npm install
gulp
```

#### Notes
1. The default gulp build tasks' list contains a [watch task](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob-opts-cb)
which means it will block the console and continuously rebuild the project when files in the source or tests folder are changed.
2. In VSCode pressing **Ctrl** + **Shift** + **B** or **T** will trigger the default build or test command respectively.

Planned releases
----------------
##### 0.1.2 (Released)
Support for index and alignment components only; *without* any formatting rules specified by a provider or format string component.

##### 0.2 (Released)
Addition of a *clr-format-config.js* sub-module/package which can be optionally installed to compliment the core implementation with various pre-defined configurations.
See [Format.Config](http://clr-format.github.io/clr-format/modules/format.config.html) for full documentation.

##### 0.3
Implementation of an invariant number formatting provider and numeric format string components.

##### 0.4
Addition of a *clr-format-intl.js* sub-module/package which can be optionally installed to provide globalization via a bridge to the
[ECMAScript's Intl namespace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl).

##### 0.5
Complete the implementation with a date formatting provider and temporal format string components.
