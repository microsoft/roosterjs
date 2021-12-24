import { ChangeSource, DocumentCommand, IEditor, PluginEventType } from 'roosterjs-editor-types';
import {
    PendableFormatCommandMap,
    PendableFormatNames,
    safeInstanceOf,
    VTable,
} from 'roosterjs-editor-dom';

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

    const tableSelection = editor.getTableSelection();

    if (tableSelection.vSelection) {
        const table = editor.getElementAtCursor('table');
        if (safeInstanceOf(table, 'HTMLTableElement')) {
            const vTable = new VTable(table);
            vTable.startRange = tableSelection.startRange;
            vTable.endRange = tableSelection.endRange;
            vTable.forEachSelectedCell(cell => {
                if (cell.td) {
                    editor.select(cell.td);
                    formatter();
                }
            });
            editor.select(range);
        }
    } else if (range && range.collapsed) {
        editor.addUndoSnapshot();
        const formatState = editor.getPendableFormatState(false /* forceGetStateFromDom */);
        formatter();
        const formatName = Object.keys(PendableFormatCommandMap).filter(
            (x: PendableFormatNames) => PendableFormatCommandMap[x] == command
        )[0] as PendableFormatNames;

        if (formatName) {
            formatState[formatName] = !formatState[formatName];
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: formatState,
            });
        }
    } else {
        editor.addUndoSnapshot(formatter, ChangeSource.Format);
    }
}
