
Typescript Titanium
===================

This repository contains ambient declarations files of
[Titanium Mobile](https://github.com/appcelerator/titanium_mobile) API
([Appcelerator](http://www.appcelerator.com/)) for
[TypeScript](http://www.typescriptlang.org/).

Downloads
---------

* [Titanium Mobile - 2.1.3](https://github.com/downloads/alvivi/typescript-titanium/titanium-2.1.3.d.ts)
* [Titanium Mobile - 2.0.2](https://github.com/downloads/alvivi/typescript-titanium/titanium-2.0.2.d.ts)
* [Titanium Mobile - 1.8.2](https://github.com/downloads/alvivi/typescript-titanium/titanium-1.8.3.d.ts)

Creating Your Own Ambient Declaration File
------------------------------------------

To create a custom ambient declaration version of titanium API you have to
generate a [JSCA](https://wiki.appcelerator.org/display/tis/JSCA+1.0+Specification)
file from [Titanium repository](https://github.com/appcelerator/titanium_mobile).
This can be done by `docgen.py` at `apidoc` folder. Then you can execute
`build.ts` to get an ambient declaration file.

```
tsc build.ts && node build.js path-to-jsca "info-text" > path-to-d.ts
```
