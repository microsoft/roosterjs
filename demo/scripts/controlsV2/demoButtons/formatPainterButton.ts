import ContentModelFormatPainterPlugin from '../../controls/contentModel/plugins/ContentModelFormatPainterPlugin';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export const formatPainterButton: RibbonButton<'formatPainter'> = {
    key: 'formatPainter',
    unlocalizedText: 'Format painter',
    iconName: 'Brush',
    onClick: () => {
        ContentModelFormatPainterPlugin.startFormatPainter();
    },
};
