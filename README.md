# [clr-format](https://github.com/clr-format/clr-format)
A lightweight, modular JavaScript implementation of a string formatting function that supports composite format strings and globalization

Installation (WIP)
------------
Once a stable version is available the following commands can be used to install the script in a context of your choice.

#### NuGet
```Install-Package clr-format```

#### Bower
```bower install clr-format```

#### Module
```npm install clr-format```

Usage
-----
The implementation of this string formatting function is inspired by .NET's (and other Microsoft® products') [Composite Formatting](https://msdn.microsoft.com/en-us/library/txafckwd.aspx) feature. Therefore the final behaviour should be similar to what's described in the [Getting started with the String.Format method](https://msdn.microsoft.com/en-us/library/system.string.format.aspx#Starting) article. The main difference is that method names in JavaScript are intrinsically camelcase therefore **String.format** should be used instead.

```javascript
    expect(
        String.format(
            "Format primitives: {0}{5}, {4}, {3}, {1}, {2}",
            0, { "a": 1 }, [2], "3", true, undefined))
        .toBe("Format primitives: 0, true, 3, {\"a\":1}, [2]");
```

Development
-----------
To develop and contribute simply install NodeJS, clone the repository, install npm dependencies and run [Gulp](http://gulpjs.com/).

###Tools (download and install)
1. [GIT](http://git-scm.com/download/)
- [NodeJS](https://nodejs.org/download/) - make sure to keep the option to add node and globally installed packages to PATH
- [VSCode](https://code.visualstudio.com/) - or any other IDE that has TypeScript language support

###Building the project
```
git clone https://github.com/clr-format/clr-format.git
npm install --global gulp
npm install
gulp
```

###Notes
1. The default gulp build tasks' list contains a [watch task](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob-opts-cb) which means it will block the console and continuously rebuild the project when files in the source or tests folder are changed.
- In VSCode pressing Ctrl + Shift + B will trigger the gulp default command.

Planned releases
----------------
#####0.1.0 (WIP)
Support for index and alignment components only; *without* any formatting rules specified by a provider or format string component. Minor versions are reserved for bug-fixes.

#####0.1.5 (WIP)
Addition of a *clr-format-configuration* sub-module/package which can be optionally installed to compliment the core implementation with various pre-defined configurations.

#####0.2.0 (WIP)
Implementation of an invariant number formatting provider and numeric format string components.

#####0.2.5 (WIP)
Addition of a *clr-format-intl* sub-module/package which can be optionally installed to bridge the core implementation with [ECMAScript's Intl namespace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl).

#####0.3.0 (WIP)
Complete the implementation with a date formatting provider and temporal format string components.
