import { retrieveModelFormatState } from 'roosterjs-content-model-core';
import type { IStandaloneEditor, ContentModelFormatState } from 'roosterjs-content-model-types';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(editor: IStandaloneEditor): ContentModelFormatState {
    const pendingFormat = editor.getPendingFormat();
    const model = editor.getContentModelCopy('reduced');
    const manager = editor.getSnapshotsManager();
    const result: ContentModelFormatState = {
        canUndo: manager.hasNewContent || manager.canMove(-1),
        canRedo: manager.canMove(1),
        isDarkMode: editor.isDarkMode(),
    };

    retrieveModelFormatState(model, pendingFormat, result);

    return result;
}
