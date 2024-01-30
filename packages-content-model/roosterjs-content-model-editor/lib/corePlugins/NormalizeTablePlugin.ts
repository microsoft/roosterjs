import { changeElementTag, safeInstanceOf, toArray } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-editor-types';

/**
 * TODO: Rename this plugin since it is not only for table now
 *
 * NormalizeTable plugin makes sure each table in editor has TBODY/THEAD/TFOOT tag around TR tags
 *
 * When we retrieve HTML content using innerHTML, browser will always add TBODY around TR nodes if there is not.
 * This causes some issue when we restore the HTML content with selection path since the selection path is
 * deeply coupled with DOM structure. So we need to always make sure there is already TBODY tag whenever
 * new table is inserted, to make sure the selection path we created is correct.
 */
class NormalizeTablePlugin implements EditorPlugin {
    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'NormalizeTable';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {}

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {}

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ExtractContentWithDom:
                normalizeListsForExport(event.clonedRoot);
                break;
        }
    }
}

function normalizeListsForExport(root: ParentNode) {
    toArray(root.querySelectorAll('li')).forEach(li => {
        const prevElement = li.previousSibling;

        if (li.style.display == 'block' && safeInstanceOf(prevElement, 'HTMLLIElement')) {
            li.style.removeProperty('display');

            prevElement.appendChild(changeElementTag(li, 'div'));
        }
    });
}

/**
 * @internal
 * Create a new instance of NormalizeTablePlugin.
 */
export function createNormalizeTablePlugin(): EditorPlugin {
    return new NormalizeTablePlugin();
}
