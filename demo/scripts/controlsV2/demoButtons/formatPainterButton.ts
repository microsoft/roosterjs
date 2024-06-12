import { FormatPainterHandler } from '../plugins/FormatPainterPlugin';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export function createFormatPainterButton(
    handler: FormatPainterHandler
): RibbonButton<'formatPainter'> {
    return {
        key: 'formatPainter',
        unlocalizedText: 'Format painter',
        iconName: 'Brush',
        onClick: () => {
            handler.startFormatPainter();
        },
    };
}
