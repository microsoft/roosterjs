import { isSuperOrSubScript } from './superOrSubScriptFormatHandler';
import { parseValueWithUnit } from '../utils/parseValueWithUnit';
import type { FontSizeFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const fontSizeFormatHandler: FormatHandler<FontSizeFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontSize = element.style.fontSize || defaultStyle.fontSize;
        const verticalAlign = element.style.verticalAlign || defaultStyle.verticalAlign;

        // when font size is 'smaller' and the style is for superscript/subscript,
        // the font size will be handled by superOrSubScript handler
        if (fontSize && !isSuperOrSubScript(fontSize, verticalAlign) && fontSize != 'inherit') {
            if (element.style.fontSize) {
                format.fontSize = normalizeFontSize(fontSize, context.segmentFormat.fontSize);
            } else if (defaultStyle.fontSize) {
                format.fontSize = fontSize;
            }
        }
    },
    apply: (format, element, context) => {
        if (format.fontSize && format.fontSize != context.implicitFormat.fontSize) {
            element.style.fontSize = format.fontSize;
        }
    },
};

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
const KnownFontSizes: Record<string, string> = {
    'xx-small': '6.75pt',
    'x-small': '7.5pt',
    small: '9.75pt',
    medium: '12pt',
    large: '13.5pt',
    'x-large': '18pt',
    'xx-large': '24pt',
    'xxx-large': '36pt',
};

function normalizeFontSize(fontSize: string, contextFont: string | undefined): string | undefined {
    const knownFontSize = KnownFontSizes[fontSize];

    if (knownFontSize) {
        return knownFontSize;
    } else if (
        fontSize == 'smaller' ||
        fontSize == 'larger' ||
        fontSize.endsWith('em') ||
        fontSize.endsWith('%')
    ) {
        if (!contextFont) {
            return undefined;
        } else {
            const existingFontSize = parseValueWithUnit(contextFont, undefined /*element*/, 'px');

            if (existingFontSize) {
                switch (fontSize) {
                    case 'smaller':
                        return Math.round((existingFontSize * 500) / 6) / 100 + 'px';
                    case 'larger':
                        return Math.round((existingFontSize * 600) / 5) / 100 + 'px';
                    default:
                        return parseValueWithUnit(fontSize, existingFontSize, 'px') + 'px';
                }
            }
        }
    } else if (fontSize == 'inherit' || fontSize == 'revert' || fontSize == 'unset') {
        return undefined;
    } else {
        return fontSize;
    }
}
