import ContentModelRibbonButton from './ContentModelRibbonButton';
import { exportContent as exportContentApi } from 'roosterjs-content-model-core';

/**
 * Key of localized strings of Zoom button
 */
export type ExportButtonStringKey = 'buttonNameExport';

/**
 * "Export content" button on the format ribbon
 */
export const exportContent: ContentModelRibbonButton<ExportButtonStringKey> = {
    key: 'buttonNameExport',
    unlocalizedText: 'Export',
    iconName: 'Export',
    flipWhenRtl: true,
    onClick: editor => {
        const win = editor.getDocument().defaultView.open();
        const html = exportContentApi(editor);
        win.document.write(editor.getTrustedHTMLHandler()(html));
    },
};
