import type { RibbonButton } from '../roosterjsReact/ribbon';
// import ContentModelFormatPainterPlugin from '../../contentModel/plugins/ContentModelFormatPainterPlugin';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export const formatPainterButton: RibbonButton<'formatPainter'> = {
    key: 'formatPainter',
    unlocalizedText: 'Format painter',
    iconName: 'Brush',
    onClick: () => {
        // ContentModelFormatPainterPlugin.startFormatPainter();
    },
};
