import type { DiagonalBorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const keys = ['diagonalDown', 'diagonalUp'] as const;
const properties = ['--rooster-diagonal-down', '--rooster-diagonal-up'];

/**
 * @internal
 */
export const diagonalBorderFormatHandler: FormatHandler<DiagonalBorderFormat> = {
    parse: (format, element) => {
        keys.forEach((key, index) => {
            const value = element.style.getPropertyValue(properties[index]).trim();
            if (value) {
                format[key] = value;
            }
        });
    },
    apply: (format, element) => {
        const lines: string[] = [];
        keys.forEach((key, index) => {
            const value = format[key];
            const style = element.ownerDocument.createElement('span').style;
            style.borderTop = value || '';
            if (
                style.borderTopStyle == 'solid' &&
                /^(?:\d+(?:\.\d+)?|\.\d+)(?:pt|px)$/.test(style.borderTopWidth) &&
                /^(?:#[0-9a-f]{6}|rgb\([\d, ]+\))$/i.test(style.borderTopColor)
            ) {
                element.style.setProperty(properties[index], style.borderTop);
                lines.push(
                    `<line x1="0" y1="${index ? 100 : 0}" x2="100" y2="${
                        index ? 0 : 100
                    }" stroke="${style.borderTopColor}" stroke-width="${
                        style.borderTopWidth
                    }" vector-effect="non-scaling-stroke"/>`
                );
            }
        });
        if (lines.length) {
            // Stretch the endpoints with the cell without stretching the physical stroke width.
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${lines.join(
                ''
            )}</svg>`;
            element.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
            element.style.backgroundSize = '100% 100%';
            element.style.backgroundRepeat = 'no-repeat';
        }
    },
};
