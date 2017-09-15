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
    initialize(editor: Editor) {        
    }

    dispose() {        
    }

    onPluginEvent(e: PluginEvent) {
        if ( e.eventType == PluginEventType.KeyPress && 
            (e as PluginDomEvent).which == 65 ) {
            alert('Hello Rooster');
        }
    }
}
```

## Usage

As a quick start, use the `createEditor()` function in `roosterjs` to create an 
editor with default configurations.

You should write this somewhere in your HTML DOM: 

```html
<div id='editor' style='width: 500px; height: 300px; border: solid 1px black'>
</div>
```

You should then run these lines of code in the browser console:

```javascript
let editor = createEditor(document.getElementById('editor'));
editor.setContent('<div>Hello Rooster!</div>');
```

To get the content of the editor, just run:

```javascript
let content = editor.getContent();
```

## Sample code

In the `/sample/` folder is a sample editor that you can explore.
To use the sample editor, follow these instructions:

1. Get dependencies using npm.
   ```cmd
   npm install
   ```

2. Build the source code.
   ```
   npm run build
   ```

3. Start the sample editor.
   ```
   npm start
   ```

4. Navigate to the sample editor at http://localhost:3000/sample/sample.htm

## License - MIT
