import { PendableFormatCommandMap, PendableFormatNames } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    DocumentCommand,
    IEditor,
    PendableFormatState,
    PluginEventType,
} from 'roosterjs-editor-types';
let pendableFormatCommands: string[] = null;

/**
 * @internal
 * Execute a document command
 * @param editor The editor instance
 * @param command The command to execute
 * @param addUndoSnapshotWhenCollapsed Optional, set to true to always add undo snapshot even current selection is collapsed.
 * Default value is false.
 * @param doWorkaroundForList Optional, set to true to do workaround for list in order to keep current format.
 * Default value is false.
 */
export default function execCommand(editor: IEditor, command: DocumentCommand) {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand(command, false, null);

    let range = editor.getSelectionRange();
    if (range && range.collapsed) {
        editor.addUndoSnapshot();
        formatter();
        if (isPendableFormatCommand(command)) {
            // Trigger PendingFormatStateChanged event since we changed pending format state
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: setPendableFormatState(editor.getPendingFormatState(), command),
            });
        }
    } else {
        editor.addUndoSnapshot(formatter, ChangeSource.Format);
    }
}

function isPendableFormatCommand(command: DocumentCommand): boolean {
    if (!pendableFormatCommands) {
        pendableFormatCommands = Object.keys(PendableFormatCommandMap).map(
            key => PendableFormatCommandMap[key as PendableFormatNames]
        );
    }
    return pendableFormatCommands.indexOf(command) >= 0;
}

function setPendableFormatState(pendableFormats: PendableFormatState, command: DocumentCommand) {
    let keys = Object.keys(PendableFormatCommandMap) as PendableFormatNames[];
    return keys.reduce((state, key) => {
        state[key] =
            pendableFormatKeyToCommand(key) === command
                ? !pendableFormats[key]
                : pendableFormats[key];
        return state;
    }, <PendableFormatState>{});
}

function pendableFormatKeyToCommand(key: string) {
    let newKey = key.replace('is', '');
    return newKey.charAt(0).toLowerCase() + newKey.slice(1);
}
