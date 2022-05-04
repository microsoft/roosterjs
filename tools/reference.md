Welcome to RoosterJs API References!

## Content

Rooster contains 6 basic packages.

1. [roosterjs](modules/roosterjs.html):
   A facade of all Rooster code for those who want a quick start. Use the
   `createEditor()` function in roosterjs to create an editor with default
   configurations.

2. [roosterjs-editor-core](modules/roosterjs_editor_core.html):
   Defines the core editor and plugin infrastructure. Use `roosterjs-editor-core`
   instead of `roosterjs` to build and customize your own editor.

3. [roosterjs-editor-api](modules/roosterjs_editor_api.html):
   Defines APIs for editor operations. Use these APIs to modify content and
   formatting in the editor you built using `roosterjs-editor-core`.

4. [roosterjs-editor-dom](modules/roosterjs_editor_dom.html):
   Defines APIs for DOM operations. Use `roosterjs-editor-api` instead unless
   you want to access DOM API directly.

5. [roosterjs-editor-plugins](modules/roosterjs_editor_plugins.html):
   Defines basic plugins for common features. Examples: making hyperlinks,
   pasting HTML content, inserting inline images.

6. [roosterjs-editor-types](modules/roosterjs_editor_types.html):
   Defines public interfaces and enumerations.

There are also some extension packages to provide additional functionalities.

1. [roosterjs-color-utils](modules/roosterjs_color_utils.html):
   Provide color transformation utility to make editor work under dark mode.

2. [roosterjs-react](modules/roosterjs_react.html):
   Provide a React wrapper of roosterjs so it can be easily used with React.

3. [roosterjs-editor-types-compatible](modules/roosterjs_editor_types_compatible.html):
   Provide types that are compatible with isolatedModules mode. When using isolatedModules mode,
   "const enum" will not work correctly, this package provides enums with prefix "Compatible" in
   their names and they have the same value with const enums in roosterjs-editor-types package

## See also

[RoosterJs Demo Site](../index.html).

[RoosterJs wiki](https://github.com/Microsoft/roosterjs/wiki)
