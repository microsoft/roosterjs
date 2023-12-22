import ContentModelRibbonButton from './ContentModelRibbonButton';

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
        // TODO
        // const win = editor.getDocument().defaultView.open();
        // win.document.write(trustedHTMLHandler(editor.getContent()));
    },
};
