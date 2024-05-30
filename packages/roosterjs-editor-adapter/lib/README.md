# RoosterJS Editor Adapter

## Introduction

For RoosterJS v9 packages be compatible with old (8._) versions, you can use EditorAdapter class from the following package which can act as a 8._ Editor.
roosterjs-editor-adapter: Provide a adapter class EditorAdapter to work with Editor (9.\*) and legacy plugins (via EditorAdapterOptions.legacyPlugins) by providing a Translation of Content Model plugin events that are going to be compatible with RoosterJS v8 plugins

## Implementation

Install the Rooster JS Editor Adapter package

```sh
npm install roosterjs-editor-adapter
```

Import the new package in the file you create the editor instance

```js
import { EditorAdapter } from 'roosterjs-editor-adapter';
```

Change from `Editor` class to use `EditorAdapter`

Before

```js
const options: EditorOptions = {
    plugins: [], /// Array of V8 plugins
    ...
}
new Editor(div, options);
```

After

```ts
const options: EditorAdapterOptions = {
    legacyPlugins: [], /// Array of V8 plugins
    plugins: [], /// Array of v9 plugins
    ...
}
return new EditorAdapter(div, options);
```

Now your v8 RoosterJS Plugins should still work even if you are using the new RoosterJS v9.
