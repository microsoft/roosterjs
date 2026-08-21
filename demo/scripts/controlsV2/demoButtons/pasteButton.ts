import { paste } from 'roosterjs-content-model-core';
import { readClipboardData } from '../../utils/readClipboardData';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Paste" button on the format ribbon
 */
export const pasteButton: RibbonButton<'buttonNamePaste'> = {
    key: 'buttonNamePaste',
    unlocalizedText: 'Paste',
    iconName: 'Paste',
    onClick: async editor => {
        const clipboardData = await readClipboardData(editor.getDocument());
        if (clipboardData) {
            paste(editor, clipboardData);
        }
    },
};
