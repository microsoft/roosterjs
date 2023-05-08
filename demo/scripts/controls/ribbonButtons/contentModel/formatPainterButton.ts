import FormatPainterPlugin from '../../contentModel/plugins/FormatPainterPlugin';
import { isContentModelEditor } from 'roosterjs-content-model';
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
            FormatPainterPlugin.startFormatPainter(editor);
        }
        return true;
    },
};
