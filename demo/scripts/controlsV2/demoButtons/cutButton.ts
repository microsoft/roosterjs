import type { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Cut button
 */
export type CutButtonStringKey = 'buttonNameCut';

/**
 * "Cut" button on the format ribbon
 */
export const cutButton: RibbonButton<CutButtonStringKey> = {
    key: 'buttonNameCut',
    unlocalizedText: ' Cut',
    iconName: 'ClearNight',
    onClick: editor => {
        const selection = editor.getDOMSelection();
        if (selection) {
            document.execCommand('cut');
        }
        return true;
    },
};
