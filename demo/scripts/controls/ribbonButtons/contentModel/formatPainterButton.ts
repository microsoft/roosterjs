import ContentModelFormatPainterPlugin from '../../contentModel/plugins/ContentModelFormatPainterPlugin';
import ContentModelRibbonButton from './ContentModelRibbonButton';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export const formatPainterButton: ContentModelRibbonButton<'formatPainter'> = {
    key: 'formatPainter',
    unlocalizedText: 'Format painter',
    iconName: 'Brush',
    onClick: editor => {
        ContentModelFormatPainterPlugin.startFormatPainter();
        return true;
    },
};
