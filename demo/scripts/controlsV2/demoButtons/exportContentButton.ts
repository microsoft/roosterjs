import { exportContent } from 'roosterjs-content-model-core';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * Key of localized strings of Zoom button
 */
export type ExportButtonStringKey =
    | 'buttonNameExport'
    | 'menuNameExportHTML'
    | 'menuNameExportText';

/**
 * "Export content" button on the format ribbon
 */
export const exportContentButton: RibbonButton<ExportButtonStringKey> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Export',
    iconName: 'Export',
    flipWhenRtl: true,
    dropDownMenu: {
        items: {
            menuNameExportHTML: 'as HTML',
            menuNameExportText: 'as Plain Text',
        },
    },
    onClick: (editor, key) => {
        const win = editor.getDocument().defaultView.open();
        let html = '';

        if (key == 'menuNameExportHTML') {
            html = exportContent(editor);
        } else if (key == 'menuNameExportText') {
            html = `<pre>${exportContent(editor, 'PlainText')}</pre>`;
        }

        win.document.write(editor.getTrustedHTMLHandler()(html));
    },
    commandBarProperties: {
        buttonStyles: {
            icon: { paddingBottom: '10px' },
        },
    },
};
