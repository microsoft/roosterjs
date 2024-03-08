Welcome to RoosterJs API References!

## Content

Rooster contains 6 basic packages.

1. [roosterjs](modules/roosterjs.html):
   A facade of all Rooster code for those who want a quick start. Use the
   `createEditor()` function in roosterjs to create an editor with default
   configurations.

2. [roosterjs-content-model-core](modules/roosterjs_content_model_core.html):
   Defines the core editor and plugin infrastructure. Use `roosterjs-content-model-core`
   instead of `roosterjs` to build and customize your own editor.

3. [roosterjs-content-model-api](modules/roosterjs_content_model_api.html):
   Defines APIs for editor operations. Use these APIs to modify content and
   formatting in the editor you built using `roosterjs-content-model-core`.

4. [roosterjs-content-model-dom](modules/roosterjs_content_model_dom.html):
   Defines APIs for Content Model and DOM operations. This package do conversion between DOM tree and roosterjs Content Model.

5. [roosterjs-content-model-plugins](modules/roosterjs_content_model_plugins.html):
   Defines basic plugins for common features.

6. [roosterjs-content-model-types](modules/roosterjs_content_model_types.html):
   Defines public interfaces and enumerations, including Content Model types, API parameters and other types.

There are also some extension packages to provide additional functionalities.

1. [roosterjs-color-utils](modules/roosterjs_color_utils.html):
   Provide color transformation utility to make editor work under dark mode.

2. [roosterjs-react](modules/roosterjs_react.html):
   Provide a React wrapper of roosterjs so it can be easily used with React.

To be compatible with old (8.\*) versions, you can use `EditorAdapter` class from the following package which can act as a 8.\* Editor:

1. [roosterjs-editor-adapter](modules/roosterjs_editor_adapter.html):
   Provide a adapter class `EditorAdapter` to work with Editor (9.\*) and legacy plugins (via [EditorAdapterOptions.legacyPlugins](interfaces/roosterjs_editor_adapter.editoradapteroptions.html#legacyplugins))

And the following packages are for old (8.\*) compatibility:

1. [roosterjs-editor-core](modules/roosterjs_editor_core.html):
2. [roosterjs-editor-api](modules/roosterjs_editor_api.html):
3. [roosterjs-editor-dom](modules/roosterjs_editor_dom.html):
4. [roosterjs-editor-plugins](modules/roosterjs_editor_plugins.html):
5. [roosterjs-editor-types](modules/roosterjs_editor_types.html):
6. [roosterjs-editor-types-compatible](modules/roosterjs_editor_types_compatible.html):

## See also

[RoosterJs Demo Site](../index.html).

[RoosterJs wiki](https://github.com/Microsoft/roosterjs/wiki)
