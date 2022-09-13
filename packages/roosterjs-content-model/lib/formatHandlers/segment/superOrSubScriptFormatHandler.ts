import { FormatHandler } from '../FormatHandler';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { SuperOrSubScriptFormat } from '../../publicTypes/format/formatParts/SuperOrSubScriptFormat';

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
                        const wrapper = element.ownerDocument.createElement(tagName);
                        moveChildNodes(wrapper, element);
                        element.appendChild(wrapper);
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
