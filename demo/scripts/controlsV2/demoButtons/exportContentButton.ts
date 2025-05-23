import { exportContent } from 'roosterjs-content-model-core';
import { ModelToTextCallbacks } from 'roosterjs-content-model-types';
import DOMPurify = require('dompurify');
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
            html = exportContent(editor);
        } else if (key == 'menuNameExportText') {
            html = `<pre>${exportContent(editor, 'PlainText', callbacks)}</pre>`;
        }

        win.document.write(
            (DOMPurify.sanitize(html, {
                ADD_TAGS: ['head', 'meta', 'iframe'],
                ADD_ATTR: ['name', 'content'],
                WHOLE_DOCUMENT: true,
                ALLOW_UNKNOWN_PROTOCOLS: true,
                RETURN_TRUSTED_TYPE: true,
            }) as any) as string
        );
    },
    commandBarProperties: {
        buttonStyles: {
            icon: { paddingBottom: '10px' },
        },
    },
};
