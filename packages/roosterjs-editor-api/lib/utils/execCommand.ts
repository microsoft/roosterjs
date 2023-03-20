import formatUndoSnapshot from './formatUndoSnapshot';
import { getObjectKeys, PendableFormatCommandMap, PendableFormatNames } from 'roosterjs-editor-dom';
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

    let formatter = () => editor.getDocument().execCommand(command, false, undefined);

    let selection = editor.getSelectionRangeEx();
    if (selection && selection.areAllCollapsed) {
        editor.addUndoSnapshot();
        const formatState = editor.getPendableFormatState(false /* forceGetStateFromDom */);
        formatter();
        const formatName = getObjectKeys(PendableFormatCommandMap).filter(
            x => PendableFormatCommandMap[x] == command
        )[0] as PendableFormatNames;

        if (formatName) {
            formatState[formatName] = !formatState[formatName];
            editor.triggerPluginEvent(PluginEventType.PendingFormatStateChanged, {
                formatState: formatState,
            });
        }
    } else {
        formatUndoSnapshot(
            editor,
            () => {
                const needToSwitchSelection = selection.type != SelectionRangeTypes.Normal;

                selection.ranges.forEach(range => {
                    if (needToSwitchSelection) {
                        editor.select(range);
                    }
                    formatter();
                });

                if (needToSwitchSelection) {
                    editor.select(selection);
                }
            },
            apiName
        );
    }
}
