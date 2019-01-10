"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roosterjs_editor_plugins_1 = require("roosterjs-editor-plugins");
var roosterjs_editor_core_1 = require("roosterjs-editor-core");
/**
 * Create an editor instance with most common options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * DefalutShortcut, HyperLink, Paste, and ContentEdit, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The editor instance
 */
function createEditor(contentDiv, additionalPlugins, initialContent) {
    var plugins = [new roosterjs_editor_plugins_1.HyperLink(), new roosterjs_editor_plugins_1.Paste(), new roosterjs_editor_plugins_1.ContentEdit()];
    if (additionalPlugins) {
        plugins = plugins.concat(additionalPlugins);
    }
    var options = {
        plugins: plugins,
        initialContent: initialContent,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };
    return new roosterjs_editor_core_1.Editor(contentDiv, options);
}
exports.default = createEditor;
//# sourceMappingURL=createEditor.js.map