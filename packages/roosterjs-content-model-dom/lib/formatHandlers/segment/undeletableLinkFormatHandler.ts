import { isElementOfType } from '../../domUtils/isElementOfType';
import {
    isLinkUndeletable,
    setLinkUndeletable,
} from '../../domUtils/hiddenProperties/undeletableLink';
import type { UndeletableFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const undeletableLinkFormatHandler: FormatHandler<UndeletableFormat> = {
    parse: (format, element) => {
        if (isElementOfType(element, 'a') && isLinkUndeletable(element)) {
            format.undeletable = true;
        }
    },

    apply: (format, element) => {
        if (format.undeletable && isElementOfType(element, 'a')) {
            setLinkUndeletable(element, true);
        }
    },
};
