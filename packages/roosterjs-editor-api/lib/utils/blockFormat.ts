import experimentCommitListChains from '../experiment/experimentCommitListChains';
import { ChangeSource, IEditor, NodePosition, Region } from 'roosterjs-editor-types';
import {
    findClosestElementAncestor,
    getSelectedTableCells,
    TableMetadata,
    VListChain,
} from 'roosterjs-editor-dom';

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
    editor.addUndoSnapshot((start, end) => {
        if (!beforeRunCallback || beforeRunCallback()) {
            const regions = editor.getSelectedRegions().filter(region => {
                const rootNode = region.rootNode;
                if (
                    !findClosestElementAncestor(rootNode, null, 'table') ||
                    rootNode.classList.contains(TableMetadata.TABLE_CELL_SELECTED) ||
                    Array.from(getSelectedTableCells(editor)).length == 0
                ) {
                    return region;
                }
            });

            const chains = VListChain.createListChains(regions, start?.node);
            regions.forEach(region => callback(region, start, end, chains));
            experimentCommitListChains(editor, chains);
        }
        editor.select(start, end);
    }, ChangeSource.Format);
}
