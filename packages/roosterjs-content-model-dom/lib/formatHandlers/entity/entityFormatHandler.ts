import { generateEntityClassList, parseEntityFormat } from '../../domUtils/entityUtils';
import type { EntityInfoFormat, IdFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const entityFormatHandler: FormatHandler<EntityInfoFormat & IdFormat> = {
    parse: (format, element) => {
        Object.assign(format, parseEntityFormat(element));
    },

    apply: (format, element) => {
        if (!format.isFakeEntity) {
            element.classList.add(...generateEntityClassList(format));
        }

        if (format.isReadonly) {
            element.contentEditable = 'false';
        } else {
            element.removeAttribute('contenteditable');
        }
    },
};
