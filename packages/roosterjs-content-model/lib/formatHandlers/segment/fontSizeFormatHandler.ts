import { FontSizeFormat } from '../../publicTypes/format/formatParts/FontSizeFormat';
import { FormatHandler } from '../FormatHandler';
import { isSuperOrSubScript } from './superOrSubScriptFormatHandler';

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
            format.fontSize = fontSize;
        }
    },
    apply: (format, element, context) => {
        if (format.fontSize && format.fontSize != context.implicitFormat.fontSize) {
            element.style.fontSize = format.fontSize;
        }
    },
};
