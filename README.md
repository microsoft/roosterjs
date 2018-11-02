[![Build Status](https://travis-ci.org/Microsoft/roosterjs.svg?branch=master)](https://travis-ci.org/Microsoft/roosterjs)

# Rooster

Rooster is a framework-independent JavaScript rich-text editor neatly nested
inside one HTML `<div>` element. Editing operations performed by end users are
handled in simple ways to generate the final HTML.

## Features

### Packages

Rooster contains 6 packages.

1. `roosterjs`:
   A facade of all Rooster code for those who want a quick start. Use the
   `createEditor()` function in roosterjs to create an editor with default
   configurations.

2. `roosterjs-editor-core`:
   Defines the core editor and plugin infrastructure. Use `roosterjs-editor-core`
   instead of `roosterjs` to build and customize your own editor.

3. `roosterjs-editor-api`:
   Defines APIs for editor operations. Use these APIs to modify content and
   formatting in the editor you built using `roosterjs-editor-core`.

4. `roosterjs-editor-dom`:
   Defines APIs for DOM operations. Use `roosterjs-editor-api` instead unless
   you want to access DOM API directly.

5. `roosterjs-editor-plugins`:
   Defines basic plugins for common features. Examples: making hyperlinks,
   pasting HTML content, inserting inline images.

6. `roosterjs-editor-types`:
   Defines public interfaces and enumerations.

### APIs

Rooster provides DOM level APIs (in `roosterjs-editor-dom`) and formatting APIs
(in `roosterjs-editor-api`) to perform editing operations.

`roosterjs-editor-dom` provides several levels of DOM operations:

- Perform basic DOM operations such as `fromHtml()`, `wrap()`, `unwrap()`, ...
- Wrap a given DOM node with `InlineElemen`t or `BlockElement` and perform
  operations with DOM Walker API.
- Perform DOM operations on a given scope using scopers.
- Travel among `InlineElements` and `BlockElements` with scope using
  ContentTraverser API.

`roosterjs-editor-api` provides APIs for scenario-based operations triggered by
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
  initialize(editor: Editor) {}

  dispose() {}

  onPluginEvent(e: PluginEvent) {
    if (e.eventType == PluginEventType.KeyPress && e.rawEvent.which == 65) {
      alert('Hello Rooster');
    }
  }
}
```

## Installation

Install via NPM or Yarn:

`yarn add roosterjs`

or

`npm install roosterjs --save`

You can also install sub packages separately:

`yarn add roosterjs-editor-core`
`yarn add roosterjs-editor-api`
`...`

or

`npm install roosterjs-editor-core --save`
`npm install roosterjs-editor-api --save`
`...`

In order to run the code below, you may also need to install [webpack](https://webpack.js.org/):

`yarn add webpack -g`

or

`npm install webpack -g`

## Usage

### A quick start

1. Create `editor.htm` contains a DIV with some styles, and a reference to a
   .js file:

```html
<html>
    <body>
        <div id='editorDiv' style='width: 500px; height: 300px; overflow: auto;
        border: solid 1px black'></div>
        <script src='editor.js'></script>
    </body>
</html>
```

2. Create `source.js` to import roosterjs and create an editor:

```javascript
var roosterjs = require('roosterjs');
var editorDiv = document.getElementById('editorDiv');
var editor = roosterjs.createEditor(editorDiv);
editor.setContent('Welcome to <b>RoosterJs</b>!');
```

3. Compile the javascript file using webpack:

`webpack source.js editor.js`

4. Navigate to editor.htm, you will see a editor shown in the page.

### Add some format buttons

1. Add some buttons into `editor.htm`:

```html
<html>
    <body>
        <div id='editorDiv' style='width: 500px; height: 300px; overflow: auto;
        border: solid 1px black'></div>
        <button id='buttonB'>B</button>
        <button id='buttonI'>I</button>
        <button id='buttonU'>U</button>
        <script src='editor.js'></script>
    </body>
</html>
```

2. Add code to `source.js` to handle click event of the buttons:

```javascript
var roosterjs = require('roosterjs');
var editorDiv = document.getElementById('editorDiv');
var editor = roosterjs.createEditor(editorDiv);
editor.setContent('Welcome to <b>RoosterJs</b>!');

document.getElementById('buttonB').addEventListener('click', function() {
  roosterjs.toggleBold(editor);
});
document.getElementById('buttonI').addEventListener('click', function() {
  roosterjs.toggleItalic(editor);
});
document.getElementById('buttonU').addEventListener('click', function() {
  roosterjs.toggleUnderline(editor);
});
```

3. Compile the javascript file using webpack:

`webpack source.js editor.js`

4. Navigate to editor.htm, you will see buttons with bold, italic, underline
   actions in the page.

## Sample code

To use the sample editor, follow these instructions:

1. Get dependencies using [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/):

   ```cmd
   yarn
   ```
   
   or
   
    ```cmd
   npm install
   ```

2. Build the source code, and start the sample editor:

   ```
   yarn start
   ```
   
   or
   
   ```
   npm start
   ```

3. Navigate to the sample editor at http://localhost:3000/publish/samplesite/sample.htm

## More documentation

We are still working on more documentation in [roosterjs wiki](https://github.com/Microsoft/roosterjs/wiki).

## License - MIT

License
Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE) License.
