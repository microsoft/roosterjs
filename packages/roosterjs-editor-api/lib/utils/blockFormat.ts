import experimentCommitListChains from '../experiment/experimentCommitListChains';
import { VListChain } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    IEditor,
    NodePosition,
    Region,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * Split selection into regions, and perform a block-wise formatting action for each region.
 */
export default function blockFormat(
    editor: IEditor,
    callback: (
        region: Region,
        start: NodePosition,
        end: NodePosition,
        chains: VListChain[]
    ) => void,
    beforeRunCallback?: () => boolean
) {
    editor.focus();
    const selection = editor.getSelectionRangeEx();
    editor.addUndoSnapshot((start, end) => {
        if (!beforeRunCallback || beforeRunCallback()) {
            const regions = editor.getSelectedRegions();
            const chains = VListChain.createListChains(regions, start?.node);
            regions.forEach(region => callback(region, start, end, chains));
            experimentCommitListChains(editor, chains);
        }
        if (selection.type == SelectionRangeTypes.Normal) {
            editor.select(start, end);
        } else if (selection.type == SelectionRangeTypes.TableSelection) {
            editor.select(selection.table, selection.coordinates);
        }
    }, ChangeSource.Format);
}
