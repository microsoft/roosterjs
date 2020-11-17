import experimentCommitListChains from '../experiment/experimentCommitListChains';
import { VListChain } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    IEditor,
    NodePosition,
    Region,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';

/**
 * @internal
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
            const regions = editor.getSelectedRegions();
            const chains = editor.isFeatureEnabled(ExperimentalFeatures.ListChain)
                ? VListChain.createListChains(regions, start?.node)
                : [];
            regions.forEach(region => callback(region, start, end, chains));
            experimentCommitListChains(editor, chains);
        }
        editor.select(start, end);
    }, ChangeSource.Format);
}
