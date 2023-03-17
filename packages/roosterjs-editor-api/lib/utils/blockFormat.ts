import commitListChains from '../utils/commitListChains';
import formatUndoSnapshot from './formatUndoSnapshot';
import { IEditor, NodePosition, Region, SelectionRangeTypes } from 'roosterjs-editor-types';
import { VListChain } from 'roosterjs-editor-dom';

/**
 * Split selection into regions, and perform a block-wise formatting action for each region.
 */
export default function blockFormat(
    editor: IEditor,
    callback: (
        region: Region,
        start: NodePosition | null,
        end: NodePosition | null,
        chains: VListChain[]
    ) => void,
    beforeRunCallback?: () => boolean,
    apiName?: string
) {
    editor.focus();
    const selection = editor.getSelectionRangeEx();

    formatUndoSnapshot(
        editor,
        (start, end) => {
            if (!beforeRunCallback || beforeRunCallback()) {
                const regions = editor.getSelectedRegions();
                if (regions.length > 0) {
                    const chains = VListChain.createListChains(regions, start?.node);
                    regions.forEach(region => callback(region, start, end, chains));
                    commitListChains(editor, chains);
                }
            }
            if (selection.type == SelectionRangeTypes.Normal && start && end) {
                editor.select(start, end);
            } else {
                editor.select(selection);
            }
        },
        apiName
    );
}
