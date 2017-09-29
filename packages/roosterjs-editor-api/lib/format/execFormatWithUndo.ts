import { Editor } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

// Exec format with undo
export default function execFormatWithUndo(editor: Editor, formatter: () => void): void {
    editor.addUndoSnapshot();
    formatter();
    editor.triggerEvent({
        eventType: PluginEventType.ContentChanged,
        source: 'Format',
    } as PluginEvent);
    editor.addUndoSnapshot();
}
