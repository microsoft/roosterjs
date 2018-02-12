import {
    DefaultShortcut,
    HyperLink,
    Paste,
    ContentEdit,
    Watermark,
    TableResize,
} from 'roosterjs-editor-plugins';
import { ImageResizePlugin } from 'roosterjs-plugin-image-resize';
import { EditorPlugin } from 'roosterjs-editor-core';
import { DefaultFormat } from 'roosterjs-editor-types';

const defaultPluginsString: string = [
    'var plugins = [',
    '  new roosterPlugins.DefaultShortcut(),',
    '  new roosterPlugins.HyperLink(),',
    '  new roosterPlugins.Paste(),',
    '  new roosterPlugins.ContentEdit(),',
    '];\n',
].join('\n');

export default function updateSampleCode(plugins?: EditorPlugin[], defaultFormat?: DefaultFormat) {
    updateHtmlSampleCode();
    updateJsSampleCode(plugins, defaultFormat);
}

function updateHtmlSampleCode() {
    let htmlSampleCode = document.getElementById('htmlSample');
    htmlSampleCode.innerHTML = '';
    let node = document.createElement('h2');
    node.innerHTML = 'Html Sample Code';
    htmlSampleCode.appendChild(node);

    let codeString: string = [
        '<html>',
        '   <body>',
        '       <div id="editorDiv" style="width: 500px; height: 300px; overflow: auto;',
        '       border: solid 1px black"></div>',
        '       <script src="editor.js"></script>',
        '   </body>',
        '</html>',
    ].join('\n');

    htmlSampleCode.appendChild(createElementFromContent('htmlSampleCode', codeString));
}

function updateJsSampleCode(plugins: EditorPlugin[], defaultFormat: DefaultFormat) {
    let jsSampleCode = document.getElementById('jsSample');
    jsSampleCode.innerHTML = '';
    let node = document.createElement('h2');
    node.innerHTML = 'JS Sample Code';
    jsSampleCode.appendChild(node);
    let startString = assembleRequireString(plugins, defaultFormat);
    let pluginsString = assemblePluginsString(plugins);
    let formatString = assembleFormatString(defaultFormat);
    let optionsString = assembleOptionsString(pluginsString, formatString);
    let endString = assembleEndString(optionsString);

    let jsCodeString = startString +
        pluginsString +
        formatString +
        optionsString +
        endString;
    jsSampleCode.appendChild(createElementFromContent('jsSampleCode', jsCodeString));
}

// Create an 'xmp' block so the code can be displayed as is
function createElementFromContent(id: string, content: string): HTMLElement {
    let node = document.createElement('xmp');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);
    node.innerHTML = content;

    return node;
}

function assemblePluginsString(plugins: EditorPlugin[]): string {
    if (plugins) {
        let pluginsString = 'var plugins = [\n';
        plugins.forEach(plugin => {
            if (plugin instanceof Watermark) {
                pluginsString += "  new roosterjsPlugins.Watermark('Type content here...'),\n";
            } else if (plugin instanceof ImageResizePlugin) {
                pluginsString += '  new roosterjsImageResizePlugin.ImageResizePlugin(),\n';
            } else if (plugin instanceof DefaultShortcut) {
                pluginsString += '  new roosterjsPlugins.DefaultShortcut(),\n';
            } else if (plugin instanceof HyperLink) {
                pluginsString += '  new roosterjsPlugins.HyperLink(),\n';
            } else if (plugin instanceof Paste) {
                pluginsString += '  new roosterjsPlugins.Paste(),\n';
            } else if (plugin instanceof ContentEdit) {
                pluginsString += '  new roosterjsPlugins.ContentEdit(),\n';
            } else if (plugin instanceof TableResize) {
                pluginsString += '  new roosterjsPlugins.TableResize(),\n';
            }
        });
        pluginsString += '];\n';

        if (pluginsString != defaultPluginsString) {
            return pluginsString;
        }
    }

    return '';
}

function assembleFormatString(defaultFormat: DefaultFormat): string {
    if (!defaultFormat) {
        return '';
    }
    let defaultFormatString = 'var defaultFormat = {\n';
    if (defaultFormat.bold) {
        defaultFormatString += '  bold: true,\n';
    }
    if (defaultFormat.italic) {
        defaultFormatString += '  italic: true,\n';
    }
    if (defaultFormat.underline) {
        defaultFormatString += '  underline: true,\n';
    }
    defaultFormatString += `  textColor: \"${defaultFormat.textColor}\",\n`;
    defaultFormatString += `  fontFamily: \"${defaultFormat.fontFamily}\",\n`;
    defaultFormatString += '};\n';
    return defaultFormatString;
}

function assembleRequireString(plugins: EditorPlugin[], defaultFormat: DefaultFormat): string {
    //If there is no plugins or defaultFormat provided, require roosterjs package only
    if (!plugins && !defaultFormat) {
        return 'var roosterjs = require(\'roosterjs\');\n';
    }

    let requireString = '';

    //If there is image resize plugin, require the image resize plugin package
    plugins.forEach(plugin => {
        if (plugin instanceof ImageResizePlugin) {
            requireString = requireString.concat(
                "var roosterjsImageResizePlugin = require('roosterjs-plugin-image-resize');\n"
            );
            return;
        }
    });

    //If there are other plugins than image resize plugins, require roosterjs plugin package
    if (plugins.length > 1) {
        requireString = requireString.concat(
            "var roosterjsPlugins = require('roosterjs-editor-plugins');\n"
        );
    }

    requireString = requireString.concat("var roosterjsCore = require('roosterjs-editor-core');\n");

    return requireString;
}

function assembleOptionsString(pluginsString: string, formatString: string): string {
    if (!pluginsString && !formatString) {
        return '';
    }
    let optionsString = 'var options = {\n';
    if (pluginsString) {
        optionsString = optionsString.concat('  plugins: plugins,\n');
    }
    if (formatString) {
        optionsString = optionsString.concat('  defaultFormat: defaultFormat,\n');
    }
    optionsString = optionsString.concat('};\n');

    return optionsString;
}

function assembleEndString(optionsString: string): string {
    let endString = "var editorDiv = document.getElementById('editorDiv');\n";
    if (optionsString) {
        endString = endString.concat('var editor = new roosterjsCore.Editor(editorDiv, options);');
    } else {
        endString = endString.concat('var editor = roosterjs.createEditor(editorDiv);');
    }

    return endString;
}
