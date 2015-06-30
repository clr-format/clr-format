# [clr-format](https://github.com/clr-format/clr-format)
A lightweight, modular JavaScript implementation of a string formatting function that supports composite format strings and globalization

Installation
------------
The following commands can be used to install the script in a context of your choice.

#### NuGet (WIP)
```Install-Package clr-format```

#### Bower
```bower install clr-format```

#### Module
```npm install clr-format```

Latest Version Capabilities
---------------------------
1. Full support for *index* \{**0**\} and *alignment* \{0**,-10**\} components.
```javascript
expect(
       String.format(
           "Format primitives: {0}{5}, {4}, {3}, {1,-8},{2,4}",
           0, { "a": 1 }, [2], "3", true, undefined))
       .toBe("Format primitives: 0, true, 3, {\"a\":1} , [2]");
```

2. Providing a *format string* \{0,-10**:0.00**\} component will result in a thrown namespaced FormatError.
```javascript
expect(
       String.format(
           "{0:00.0}", 1))
       .toThrowError(Format.Errors.FormatError);
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
```


Development
-----------
The implementation of this string formatting function is inspired by .NET's (and other Microsoft® products') [Composite Formatting](https://msdn.microsoft.com/en-us/library/txafckwd.aspx) feature. Therefore the final behaviour should be similar to what's described in the [Getting started with the String.Format method](https://msdn.microsoft.com/en-us/library/system.string.format.aspx#Starting) article. The main difference is that method names in JavaScript are intrinsically camelcase therefore **String.format** should be used instead.

To develop and contribute simply install NodeJS, clone the repository, install npm dependencies and run [Gulp](http://gulpjs.com/).

### Tools (download and install)
1. [GIT](http://git-scm.com/download/)
2. [NodeJS](https://nodejs.org/download/) - make sure to keep the option to add node and globally installed packages to PATH
3. [VSCode](https://code.visualstudio.com/) - or any other IDE that has TypeScript language support

### Building the project
```bash
git clone https://github.com/clr-format/clr-format.git
npm install --global gulp
npm install
gulp
```

### Notes
1. The default gulp build tasks' list contains a [watch task](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob-opts-cb) which means it will block the console and continuously rebuild the project when files in the source or tests folder are changed.
2. In VSCode pressing Ctrl + Shift + B will trigger the gulp default command.

Planned releases
----------------
##### 0.1.1 (Released)
Support for index and alignment components only; *without* any formatting rules specified by a provider or format string component. Minor versions are reserved for bug-fixes.

##### 0.2
Addition of a *clr-format-configuration* sub-module/package which can be optionally installed to compliment the core implementation with various pre-defined configurations.

##### 0.3
Implementation of an invariant number formatting provider and numeric format string components.

##### 0.4
Addition of a *clr-format-intl* sub-module/package which can be optionally installed to bridge the core implementation with [ECMAScript's Intl namespace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl).

##### 0.5
Complete the implementation with a date formatting provider and temporal format string components.
