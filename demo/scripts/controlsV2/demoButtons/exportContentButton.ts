import { defaultModelToDomOptions } from '../options/defaultContentModelOptions';
import { exportContent } from 'roosterjs-content-model-core';
import { ModelToTextCallbacks } from 'roosterjs-content-model-types';
import type { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Zoom button
 */
export type ExportButtonStringKey =
    | 'buttonNameExport'
    | 'menuNameExportHTML'
    | 'menuNameExportText';

const callbacks: ModelToTextCallbacks = {
    onImage: () => '[Image]',
};

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
            html = exportContent(editor, 'HTML', defaultModelToDomOptions);
        } else if (key == 'menuNameExportText') {
            html = `<pre>${exportContent(editor, 'PlainText', callbacks)}</pre>`;
        }

        win.document.write(editor.getTrustedHTMLHandler()(html));
    },
    commandBarProperties: {
        buttonStyles: {
            icon: { paddingBottom: '10px' },
        },
    },
};
