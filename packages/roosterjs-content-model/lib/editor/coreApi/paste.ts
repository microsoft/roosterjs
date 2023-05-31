import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { Position } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ClipboardData,
    EditorCore,
    GetContentMode,
    PasteApi,
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
    const cmCore = core as ContentModelEditorCore;

    if (clipboardData.snapshotBeforePaste) {
        // Restore original content before paste a new one
        cmCore.api.setContent(
            core,
            clipboardData.snapshotBeforePaste,
            true /* triggerContentChangedEvent */
        );
    } else {
        clipboardData.snapshotBeforePaste = cmCore.api.getContent(
            cmCore,
            GetContentMode.RawHTMLWithSelection
        );
    }

    const range = cmCore.api.getSelectionRange(core, true);
    const pos = range && Position.getStart(range);
    const pasteModel = cmCore.api.createPasteModel(
        cmCore,
        clipboardData,
        pos,
        pasteAsText,
        applyCurrentFormat,
        pasteAsImage
    );

    if (pasteModel) {
        cmCore.api.formatWithContentModel(
            cmCore,
            'Paste',
            model => {
                mergeModel(model, pasteModel, cmCore.onDeleteEntityCallback(cmCore));
                return true;
            },
            {
                changeSource: ChangeSource.Paste,
            }
        );
    }
};
