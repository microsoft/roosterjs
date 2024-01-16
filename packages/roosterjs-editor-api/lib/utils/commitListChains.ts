import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';
import type { IEditor } from 'roosterjs-editor-types';
import type { VListChain } from 'roosterjs-editor-dom';

/**
 * Commit changes of all list changes when experiment features are allowed
 * @param editor The Editor object
 * @param chains List chains to commit
 */
export default function commitListChains(editor: IEditor, chains: VListChain[]) {
    if (chains?.length > 0) {
        const range = editor.getSelectionRange();
        const start = range && Position.getStart(range);
        const end = range && Position.getEnd(range);
        const shouldReuseAllAncestorListElements = editor.isFeatureEnabled(
            ExperimentalFeatures.ReuseAllAncestorListElements
        );
        const shouldDisableListChain = editor.isFeatureEnabled(
            ExperimentalFeatures.DisableListChain
        );

        chains.forEach(chain =>
            chain.commit(shouldReuseAllAncestorListElements, shouldDisableListChain)
        );

        if (start && end) {
            editor.select(start, end);
        }
    }
}

/**
 * @deprecated
 * Same with commitListChains, keep this export just for backward compatibility
 */
export const experimentCommitListChains = commitListChains;
