import ContentModelFormatPainterPlugin from '../../contentModel/plugins/ContentModelFormatPainterPlugin';
import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export const formatPainterButton: RibbonButton<'formatPainter'> = {
    key: 'formatPainter',
    unlocalizedText: 'Format painter',
    iconName: 'Brush',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            ContentModelFormatPainterPlugin.startFormatPainter(editor);
        }
        return true;
    },
};
