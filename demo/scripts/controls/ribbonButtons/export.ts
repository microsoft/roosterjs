import { RibbonButton } from 'roosterjs-react';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';

/**
 * "Export content" button on the format ribbon
 */
export const exportContent: RibbonButton = {
    key: 'exportContent',
    unlocalizedText: 'Export',
    iconName: 'Export',
    onClick: editor => {
        const win = editor.getDocument().defaultView.open();
        win.document.write(trustedHTMLHandler(editor.getContent()));
    },
};
