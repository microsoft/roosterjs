import { createWordCssLookup } from '../WordDesktop/createWordCssLookup';
import type { FormatParser, TextStrokeFormat } from 'roosterjs-content-model-types';

const prefix = 'mso-style-textoutline-';
const names = [
    'type',
    'fill-color',
    'fill-alpha',
    'outlinestyle-dpiwidth',
    'outlinestyle-dash',
    'outlinestyle-align',
    'outlinestyle-compound',
    'outlinestyle-join',
];

/**
 * @internal
 */
export function createWordTextStrokeParser(html: string): FormatParser<TextStrokeFormat> {
    const lookup = createWordCssLookup(
        html,
        names.map(name => prefix + name)
    );
    return (format, element) => {
        const styles = lookup(element);
        const value = (name: string) => styles[prefix + name]?.trim().toLowerCase();
        const explicitWidth = element.style.getPropertyValue('-webkit-text-stroke-width');
        const explicitColor = element.style.getPropertyValue('-webkit-text-stroke-color');
        if (value('type') == 'none') {
            if (!explicitWidth) {
                format.textStrokeWidth = '0px';
            }
        } else if (
            value('type') == 'solid' &&
            (!value('outlinestyle-dash') || value('outlinestyle-dash') == 'solid') &&
            (!value('outlinestyle-align') || value('outlinestyle-align') == 'center') &&
            (!value('outlinestyle-compound') || value('outlinestyle-compound') == 'simple') &&
            (!value('outlinestyle-join') || value('outlinestyle-join') == 'miter')
        ) {
            const width = value('outlinestyle-dpiwidth');
            const color = value('fill-color');
            const alpha = value('fill-alpha');
            if (!explicitWidth && width && /^(?:\d+(?:\.\d+)?|\.\d+)pt$/.test(width)) {
                format.textStrokeWidth = width;
            }
            if (
                !explicitColor &&
                /^#[0-9a-f]{6}$/.test(color || '') &&
                (!alpha || (/^(?:\d+(?:\.\d+)?|\.\d+)%$/.test(alpha) && parseFloat(alpha) <= 100))
            ) {
                const rgb = [1, 3, 5].map(start => parseInt(color.substr(start, 2), 16));
                format.textStrokeColor = `rgba(${rgb.join(', ')}, ${
                    alpha ? parseFloat(alpha) / 100 : 1
                })`;
            }
        }
    };
}
