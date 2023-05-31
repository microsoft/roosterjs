import { Position } from 'roosterjs-editor-dom';
import {
    EditorCore,
    PasteApi,
    ChangeSource,
    ClipboardData,
    GetContentMode,
} from 'roosterjs-editor-types';

export const paste: PasteApi = (
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteAsText: boolean,
    applyCurrentFormat: boolean,
    pasteAsImage: boolean
) => {
    if (!clipboardData) {
        return;
    }

    if (clipboardData.snapshotBeforePaste) {
        // Restore original content before paste a new one
        core.api.setContent(
            core,
            clipboardData.snapshotBeforePaste,
            true /* triggerContentChangedEvent */
        );
    } else {
        clipboardData.snapshotBeforePaste = core.api.getContent(
            core,
            GetContentMode.RawHTMLWithSelection
        );
    }

    const range = core.api.getSelectionRange(core, true /* tryGetFromCache */);
    const pos = range && Position.getStart(range);
    const fragment = core.api.createPasteFragment(
        core,
        clipboardData,
        pos,
        pasteAsText,
        applyCurrentFormat,
        pasteAsImage
    );
    if (fragment) {
        core.api.addUndoSnapshot(
            core,
            () => {
                core.api.insertNode(core, fragment, null /* InsertOption */);
                return clipboardData;
            },
            ChangeSource.Paste,
            false /* canUndoByBackspace */
        );
    }
};
