import { DocumentCommand } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import type { PendableFormatState } from 'roosterjs-editor-types';
import type { StandaloneEditorCore } from 'roosterjs-content-model-types';

// @deprecated
// Keep this map for legacy API support. In theory we should never use this.
const PendableFormatCommandMap: Record<keyof PendableFormatState, DocumentCommand> = {
    isBold: DocumentCommand.Bold,
    isItalic: DocumentCommand.Italic,
    isStrikeThrough: DocumentCommand.StrikeThrough,
    isSubscript: DocumentCommand.Subscript,
    isSuperscript: DocumentCommand.Superscript,
    isUnderline: DocumentCommand.Underline,
};

/**
 * @internal
 * @deprecated This function is deprecated. We just keep a basic implementation here to be compatible with IEditor interface
 * In theory this function should never be used now.
 */
export function getPendableFormatState(core: StandaloneEditorCore): PendableFormatState {
    const doc = core.contentDiv.ownerDocument;
    const result: PendableFormatState = {};

    getObjectKeys(PendableFormatCommandMap).forEach(key => {
        result[key] = doc.queryCommandState(PendableFormatCommandMap[key]);
    });

    return result;
}
