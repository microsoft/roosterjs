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

        if (isSuperOrSubScript(fontSize, verticalAlign)) {
            format.superOrSubScriptSequence = (format.superOrSubScriptSequence || '')
                .split(' ')
                .concat(verticalAlign)
                .join(' ')
                .trim();
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
                        wrapAllChildNodes(element, tagName);
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
