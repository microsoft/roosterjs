import { RibbonButton } from 'roosterjs-react';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';

/**
 * Key of localized strings of Zoom button
 */
export type ExportButtonStringKey = 'buttonNameExport';

/**
 * "Export content" button on the format ribbon
 */
export const exportContent: RibbonButton<ExportButtonStringKey> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Export',
    iconName: 'Export',
    flipWhenRtl: true,
    onClick: editor => {
        const win = editor.getDocument().defaultView.open();
        win.document.write(trustedHTMLHandler(editor.getContent()));
    },
};
