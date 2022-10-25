import formatUndoSnapshot from './formatUndoSnapshot';
import selectWordFromCollapsedRange from './selectWordFromCollapsedRange';
import { getObjectKeys, PendableFormatCommandMap, PendableFormatNames } from 'roosterjs-editor-dom';
//import { ContentPosition } from 'roosterjs-editor-types/lib/enum/ContentPosition';
//import findClosestElementAncestor from 'roosterjs-editor-dom/lib/utils/findClosestElementAncestor';
import {
    DocumentCommand,
    IEditor,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import type { CompatibleDocumentCommand } from 'roosterjs-editor-types/lib/compatibleTypes';

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
export default function execCommand(
    editor: IEditor,
    command: DocumentCommand | CompatibleDocumentCommand,
    apiName?: string
) {
    editor.focus();

    let formatter = () => editor.getDocument().execCommand(command, false, null);

    let selection = editor.getSelectionRangeEx();

    if (selection && selection.areAllCollapsed) {
        editor.addUndoSnapshot();
        const formatState = editor.getPendableFormatState(false /* forceGetStateFromDom */);
        formatter();

        const formatName = getObjectKeys(PendableFormatCommandMap).filter(
            x => PendableFormatCommandMap[x] == command
        )[0] as PendableFormatNames;

        formatUndoSnapshot(editor);

        /*
        const ciu = findClosestElementAncestor(
            selection.ranges[0].commonAncestorContainer,
            editor.getDocument().body,
            'TEXT'
        );
        editor.select(ciu);
        console.log(selection.ranges[0], ciu);
        debugger;*/

        if (formatName) {
            selectWordFromCollapsedRange(editor.getSelectionRange(), editor);
            formatState[formatName] = !formatState[formatName];
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: formatState,
            });
        }
    } else {
        formatUndoSnapshot(
            editor,
            () => {
                let tempRange: Range;
                selection.ranges.forEach(range => {
                    if (selection.type == SelectionRangeTypes.TableSelection) {
                        editor.select(range);
                    }

                    formatter();

                    tempRange = range;
                });

                if (tempRange && selection.type == SelectionRangeTypes.TableSelection) {
                    editor.select(selection.table, selection.coordinates);
                }
            },
            apiName
        );
    }
}
