import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { VListChain } from 'roosterjs-editor-dom';

/**
 * Commit changes of all list changes when experiment features are allowed
 * @param editor The Editor object
 * @param chains List chains to commit
 */
export default function experimentCommitListChains(editor: IEditor, chains: VListChain[]) {
    if (chains?.length > 0) {
        editor.addUndoSnapshot((start, end) => {
            chains.forEach(chain => chain.commit());
            editor.select(start, end);
        }, ChangeSource.ListChain);
    }
}
