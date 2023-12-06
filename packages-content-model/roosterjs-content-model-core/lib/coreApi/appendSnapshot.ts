import type { AppendSnapshot, DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 * Add an undo snapshot to current undo snapshot stack
 * @param core The StandaloneEditorCore object
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param entityStates @optional Entity states related to this snapshot.
 * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
 * when undo/redo to this snapshot
 */
export const appendSnapshot: AppendSnapshot = (core, canUndoByBackspace, entityStates) => {
    if (!core.lifecycle.shadowEditFragment) {
        const selection = core.api.getDOMSelection(core);
        const metadata = convertDomSelectionToMetadata(
            core.contentDiv,
            selection,
            !!core.lifecycle.isDarkMode
        );

        core.undo.snapshotsService.addSnapshot(
            {
                html: core.contentDiv.innerHTML,
                metadata,
                knownColors: core.darkColorHandler?.getKnownColorsCopy() || [],
                entityStates,
            },
            !!canUndoByBackspace
        );
        core.undo.hasNewContent = false;
    }
};

function convertDomSelectionToMetadata(
    contentDiv: HTMLElement,
    selection: DOMSelection | null,
    isDarkMode: boolean
): SnapshotMetadata | null {
    switch (selection?.type) {
        case 'table':
            return {
                type: SelectionRangeTypes.TableSelection,
                tableId: selection.table.id,
                firstCell: {
                    x: selection.firstColumn,
                    y: selection.firstRow,
                },
                lastCell: {
                    x: selection.lastColumn,
                    y: selection.lastRow,
                },
                isDarkMode,
            };
        case 'image':
            return {
                type: SelectionRangeTypes.ImageSelection,
                imageId: selection.image.id,
                isDarkMode,
            };
        case 'range':
            return {
                type: SelectionRangeTypes.Normal,
                isDarkMode,
                start: [],
                end: [],
                ...(getSelectionPath(contentDiv, selection.range) || {}),
            };
        default:
            return null;
    }
}
