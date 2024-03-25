[![Build Status](https://github.com/microsoft/roosterjs/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/microsoft/roosterjs/actions/workflows/build-and-deploy.yml)

# Rooster

Rooster is a framework-independent JavaScript rich-text editor neatly nested
inside one HTML `<div>` element. Editing operations performed by end users are
handled in simple ways to generate the final HTML.

Rooster is working on top of a middle layer data structure called "Content Model".
All format API and editing operation are using this Content Model layer as content format,
and finally convert to HTML and show it in editor.

To view the demo site, please click the link below:

[RoosterJs Demo Site](https://microsoft.github.io/roosterjs/index.html).

## Features

### Packages

Rooster contains 6 basic packages.

1. [roosterjs](https://microsoft.github.io/roosterjs/docs/modules/roosterjs.html):
   A facade of all Rooster code for those who want a quick start. Use the
   `createEditor()` function in roosterjs to create an editor with default
   configurations.

2. [roosterjs-content-model-core](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_content_model_core.html):
   Defines the core editor and plugin infrastructure. Use `roosterjs-content-model-core`
   instead of `roosterjs` to build and customize your own editor.

3. [roosterjs-content-model-api](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_content_model_api.html):
   Defines APIs for editor operations. Use these APIs to modify content and
   formatting in the editor you built using `roosterjs-content-model-core`.

4. [roosterjs-content-model-dom](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_content_model_dom.html):
   Defines APIs for Content Model and DOM operations. This package do conversion between DOM tree and roosterjs Content Model.

5. [roosterjs-content-model-plugins](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_content_model_plugins.html):
   Defines basic plugins for common features.

6. [roosterjs-content-model-types](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_content_model_types.html):
   Defines public interfaces and enumerations, including Content Model types, API parameters and other types.

There are also some extension packages to provide additional functionalities.

1. [roosterjs-color-utils](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_color_utils.html):
   Provide color transformation utility to make editor work under dark mode.

2. [roosterjs-react](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_react.html):
   Provide a React wrapper of roosterjs so it can be easily used with React.

To be compatible with old (8.\*) versions, you can use `EditorAdapter` class from the following package which can act as a 8.\* Editor:

1. [roosterjs-editor-adapter](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_adapter.html):
   Provide a adapter class `EditorAdapter` to work with Editor (9.\*) and legacy plugins (via [EditorAdapterOptions.legacyPlugins](https://microsoft.github.io/roosterjs/docs/interfaces/roosterjs_editor_adapter.editoradapteroptions.html#legacyplugins))

And the following packages are for old (8.\*) compatibility:

1. [roosterjs-editor-core](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_core.html):
2. [roosterjs-editor-api](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_api.html):
3. [roosterjs-editor-dom](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_dom.html):
4. [roosterjs-editor-plugins](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_plugins.html):
5. [roosterjs-editor-types](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_types.html):
6. [roosterjs-editor-types-compatible](https://microsoft.github.io/roosterjs/docs/modules/roosterjs_editor_types_compatible.html):

### APIs

Rooster provides Content Model level APIs (in `roosterjs-content-model-dom`), core APIs (in `roosterjs-content-model-core`), and formatting APIs
(in `roosterjs-content-modelapi`) to perform editing operations.

`roosterjs-content-model-dom` provides several levels of Content Model operations:

-   Create Content Model elements
-   Convert DOM tree to Content Model
-   Convert Content Model to DOM tree
-   Format handlers
-   A few DOM level API

`roosterjs-content-model-core` provides APIs for editor core. Editor class will call such
APIs to perform basic editor operations. These APIs can be overridden by specifying
API overrides in Editor options when creating the editor.

`roosterjs-content-model-api` provides APIs for scenario-based operations triggered by
user interaction.

## Plugins

Rooster supports plugins. You can use built-in plugins or build your own.
Plugins call APIs to communicate with the editor. When an operation is
performed by the user or when content is changed by code, the editor will
trigger events for the plugins to handle.

Here's a sample plugin which will show a dialog containing "Hello Rooster" when
an "a" is typed in the editor:

```typescript
class HelloRooster implements EditorPlugin {
    getName() {
        return 'HelloRooster';
    }

    initialize(editor: IEditor) {}

    dispose() {}

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == 'input' && e.rawEvent.which == 65) {
            alert('Hello Rooster');
        }
    }
}
```

## Installation

Install via NPM or Yarn:

`yarn add roosterjs`

You can also install sub packages separately:

`yarn add roosterjs-content-model-core`

`yarn add roosterjs-content-model-api`

`...`

In order to run the code below, you may also need to install [webpack](https://webpack.js.org/):

`yarn add webpack -g`

## Usage

### A quick start

1. Create `editor.htm` which contains a DIV with some styles, buttons to handle some click events and a reference to rooster.js (update with the path to your rooster.js file):

```html
<html>
    <body>
        <div style="width: 500px; height: 400px; border: solid 1px black" id="contentDiv"></div>
        <button id="buttonB">B</button> <button id="buttonI">I</button>
        <button id="buttonU">U</button>
        <script src="rooster.js"></script>
        <script>
            var contentDiv = document.getElementById('contentDiv');
            var editor = roosterjs.createEditor(contentDiv);

            editor.setContent('Welcome to <b>RoosterJs</b>!');
            document.getElementById('buttonB').addEventListener('click', function () {
                roosterjs.toggleBold(editor);
            });
            document.getElementById('buttonI').addEventListener('click', function () {
                roosterjs.toggleItalic(editor);
            });
            document.getElementById('buttonU').addEventListener('click', function () {
                roosterjs.toggleUnderline(editor);
            });
        </script>
    </body>
</html>
```

2. Navigate to editor.htm, you will see a editor shown in the page which includes buttons with bold, italic, underline
   actions.

## Sample code

To view the demo site, please click [here](https://microsoft.github.io/roosterjs/index.html).

To build the demo site code yourself, follow these instructions:

1. Get dependencies using [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/):

    ```cmd
    yarn
    ```

2. Build the source code, and start the sample editor:

    ```
    yarn start
    ```

    or

    ```
    npm start
    ```

## Debugging

There are two options for debugging:

1. Debugging from VSCode

    - Ensure the sample editor is running
    - Set the breakpoints within VSCode
    - Select "Debug app in Chrome" from the VSCode debugging configuration dropdown
      <img src="/assets/readme-images/debug-in-VSCode.png" width="411" height="278"><br>
    - Run the scenario that needs to be debugged

2. Debugging directly from the development tools within the web browser
    - The directions for how to do this are specific to each web browser. By opening the developer
      tools for the web browser that Rooster is running on, you will be able to set breakpoints in
      the code and debug accordingly.

## Running tests

There are two ways that tests can be run:

1. Run all tests or a single test from VSCode<br>
    - (Skip if running all tests) Ensure the file that you want to test is selected (ie: toggleBold.ts
      or toggleBoldTest.ts)
    - Select "Test all files" or "Test current file" from the VSCode debugging configuration dropdown
      <img src="/assets/readme-images/test-in-VSCode.png" width="402" height="268">
2. Run all tests from command line
    ```
    yarn test
    ```

## Dependencies

As a NodeJs package, RoosterJs has dependencies for runtime (specified in package.json under each sub
packages in "dependencies" section) and dependencies for build time (specified in package.json under
root path in "devDependencies" section).

For runtime dependencies, there are two parts:

-   Internal dependencies (a RoosterJs package depends on other RoosterJs packages)
-   External dependencies (RoosterJs depends on other NPM packages)

Currently we have very few external dependencies. Before adding any new dependency, we need to check:

1. What's the value of the new dependency and the code using the dependency bring into roosterjs?
   If we add a new dependency and create our new API to just call into the dependency, that new API
   doesn't actually bring too much value, and people who uses roosterjs in their project can do this
   themselves in their code, and we should not add such dependency to people who don't really need it.

2. What's the dependency tree of the dependency?
   If we introduce a new dependency which has a deep dependency tree, we need to be careful since it
   means we are actually adding a lot of new dependencies and our code size may be increased a lot.

3. How much functionalities do we need from the dependency?
   If the dependency provides a lot of functionalities but we actually only need a small piece of them,
   we may need to consider other solutions, such as find another smaller one, or do it ourselves.

4. What's the license of the dependency?
   A dependency package under MIT license is good to be used for RoosterJs. For other licenses, we need
   to review and see if we can take it as a dependency.

If you still feel a new dependency is required after checking these questions, we can review it and
finally decide whether we should add the new dependency.

For build time dependencies, it is more flexible to add new dependencies since it won't increase runtime
code size or dependencies.

## More documentation

We are still working on more documentation in [roosterjs wiki](https://github.com/Microsoft/roosterjs/wiki) and [API reference](https://microsoft.github.io/roosterjs/docs/index.html).

## License - MIT

License
Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE) License.
