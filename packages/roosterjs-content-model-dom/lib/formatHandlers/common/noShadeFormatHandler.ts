import { isElementOfType } from '../../domUtils/isElementOfType';
import type { FormatHandler } from '../FormatHandler';
import type { NoShadeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const noShadeFormatHandler: FormatHandler<NoShadeFormat> = {
    parse: (format, element) => {
        if (isElementOfType(element, 'hr') && element.hasAttribute('noshade')) {
            format.noShade = true;
        }
    },
    apply: (format, element) => {
        if (isElementOfType(element, 'hr')) {
            if (format.noShade) {
                element.setAttribute('noshade', '');
            } else {
                element.removeAttribute('noshade');
            }
        }
    },
};
