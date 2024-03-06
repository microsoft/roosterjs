import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
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
        FormatPainterPlugin.startFormatPainter();
    },
};
