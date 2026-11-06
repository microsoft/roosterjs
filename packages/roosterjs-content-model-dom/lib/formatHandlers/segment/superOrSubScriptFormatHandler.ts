import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type { FormatHandler } from '../FormatHandler';
import type { SuperOrSubScriptFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const superOrSubScriptFormatHandler: FormatHandler<SuperOrSubScriptFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const verticalAlign = element.style.verticalAlign || defaultStyle.verticalAlign;
        const fontSize = element.style.fontSize || defaultStyle.fontSize;

        const inheritFontSize =
            (element.tagName == 'SUP' || element.tagName == 'SUB') && fontSize == 'inherit';

        if (
            isSuperOrSubScript(fontSize, verticalAlign) ||
            (inheritFontSize && (verticalAlign == 'super' || verticalAlign == 'sub'))
        ) {
            format.superOrSubScriptSequence = (format.superOrSubScriptSequence || '')
                .split(' ')
                .concat(verticalAlign)
                .join(' ')
                .trim();
            if (inheritFontSize) {
                format.superOrSubScriptFontSize = 'inherit';
            }
        }
    },
    apply: (format, element) => {
        if (format.superOrSubScriptSequence) {
            format.superOrSubScriptSequence
                .split(' ')
                .reverse()
                .forEach(value => {
                    const tagName = value == 'super' ? 'sup' : value == 'sub' ? 'sub' : null;

                    if (tagName) {
                        const wrapper = wrapAllChildNodes(element, tagName);
                        if (format.superOrSubScriptFontSize) {
                            wrapper.style.fontSize = format.superOrSubScriptFontSize;
                        }
                    }
                });
        }
    },
};

/**
 * @internal
 */
export function isSuperOrSubScript(
    fontSize: string | undefined,
    verticalAlign: string | undefined
): verticalAlign is 'sub' | 'super' {
    return fontSize == 'smaller' && (verticalAlign == 'sub' || verticalAlign == 'super');
}
