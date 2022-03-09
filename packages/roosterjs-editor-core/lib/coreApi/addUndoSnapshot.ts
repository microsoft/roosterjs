import { Position } from 'roosterjs-editor-dom';
// import { getSelectionPath, getTagOfNode, Position, queryElements } from 'roosterjs-editor-dom';
import {
    AddUndoSnapshot,
    ChangeSource,
    ContentChangedEvent,
    EditorCore,
    NodePosition,
    PluginEventType,
    GetContentMode,
    // SelectionRangeTypes,
    // SelectionPath,
    // TableSelection,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 */
export const addUndoSnapshot: AddUndoSnapshot = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition) => any,
    changeSource: ChangeSource | string,
    canUndoByBackspace: boolean
) => {
    const undoState = core.undo;
    const isNested = undoState.isNested;
    const isShadowEdit = !!core.lifecycle.shadowEditFragment;
    let data: any;

    if (!isNested) {
        undoState.isNested = true;

        if (!isShadowEdit) {
            undoState.snapshotsService.addSnapshot(
                core.api.getContent(core, GetContentMode.RawHTMLWithSelection),
                canUndoByBackspace
            );
            undoState.hasNewContent = false;
        }
    }

    try {
        if (callback) {
            let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            data = callback(
                range && Position.getStart(range).normalize(),
                range && Position.getEnd(range).normalize()
            );

            if (!isNested && !isShadowEdit) {
                undoState.snapshotsService.addSnapshot(
                    core.api.getContent(core, GetContentMode.RawHTMLWithSelection),
                    false /*isAutoCompleteSnapshot*/
                );
                undoState.hasNewContent = false;
            }
        }
    } finally {
        if (!isNested) {
            undoState.isNested = false;
        }
    }

    if (callback && changeSource) {
        let event: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: changeSource,
            data: data,
        };
        core.api.triggerEvent(core, event, true /*broadcast*/);
    }

    if (canUndoByBackspace) {
        const range = core.api.getSelectionRange(core, false /*tryGetFromCache*/);

        if (range) {
            core.undo.hasNewContent = false;
            core.undo.autoCompletePosition = Position.getStart(range);
        }
    }
};

// interface SnapshotSelectionBase<T extends SelectionRangeTypes> {
//     type: T;
// }

// interface NormalSnapshotSelection extends SnapshotSelectionBase<SelectionRangeTypes.Normal> {
//     path: SelectionPath;
// }

// interface TableSnapshotSelection extends SnapshotSelectionBase<SelectionRangeTypes.TableSelection> {
//     tableId: string;
//     coordinates: TableSelection;
// }

// interface UndoSnapshot {
//     html: string;
//     isDarkMode: boolean;
//     selection: NormalSnapshotSelection | TableSnapshotSelection | undefined;
// }

// function createUndoSnapshot(core: EditorCore): UndoSnapshot {
//     const rangeEx = core.api.getSelectionRangeEx(core);
//     const normalRange = rangeEx.type == SelectionRangeTypes.Normal && rangeEx.ranges[0];
//     const { startContainer, endContainer, startOffset, endOffset } = normalRange || {};
//     let isDOMChanged = false;

//     queryElements(core.contentDiv, 'table', table => {
//         let tbody: HTMLTableSectionElement | null = null;

//         for (let child = table.firstChild; child; child = child.nextSibling) {
//             if (getTagOfNode(child) == 'TR') {
//                 if (!tbody) {
//                     tbody = table.ownerDocument.createElement('tbody');
//                     table.insertBefore(tbody, child);
//                 }

//                 tbody.appendChild(child);
//                 child = tbody;

//                 isDOMChanged = true;
//             } else {
//                 tbody = null;
//             }
//         }
//     });

//     if (normalRange && isDOMChanged) {
//         try {
//             normalRange.setStart(startContainer, startOffset);
//             normalRange.setEnd(endContainer, endOffset);
//         } catch {}
//     }

//     return {
//         html: core.contentDiv.innerHTML,
//         isDarkMode: core.lifecycle.isDarkMode,
//         selection: normalRange
//             ? {
//                   type: SelectionRangeTypes.Normal,
//                   path: getSelectionPath(core.contentDiv, normalRange),
//               }
//             : rangeEx.type == SelectionRangeTypes.TableSelection
//             ? {
//                   type: SelectionRangeTypes.TableSelection,
//                   tableId: rangeEx.table.id,
//                   coordinates: rangeEx.coordinates,
//               }
//             : undefined,
//     };
// }
