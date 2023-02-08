import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { FormatHandler } from '../FormatHandler';
import { isSuperOrSubScript } from './superOrSubScriptFormatHandler';

/**
 * @internal
 */
export const computedSegmentFormatHandler: FormatHandler<ContentModelSegmentFormat> = {
    parse: (format, element) => {
        const computedStyles = element.ownerDocument.defaultView?.getComputedStyle(element);

        if (computedStyles) {
            const {
                fontFamily,
                fontSize,
                fontWeight,
                fontStyle,
                textDecoration,
                verticalAlign,
                color,
            } = computedStyles;

            if (fontFamily) {
                format.fontFamily = fontFamily;
            }

            if (fontSize) {
                format.fontSize = fontSize;
            }

            if (fontWeight && fontWeight != '400' && fontWeight != 'normal') {
                format.fontWeight = fontWeight;
            }

            if (fontStyle) {
                format.italic = fontStyle == 'italic' || fontStyle == 'oblique';
            }

            if (textDecoration) {
                format.strikethrough = textDecoration.indexOf('line-through') >= 0;
                format.underline = textDecoration.indexOf('underline') >= 0;
            }

            if (isSuperOrSubScript(fontSize, verticalAlign)) {
                format.superOrSubScriptSequence = verticalAlign;
            }

            if (color) {
                format.textColor = color;
            }
        }
    },
    apply: () => {},
};
