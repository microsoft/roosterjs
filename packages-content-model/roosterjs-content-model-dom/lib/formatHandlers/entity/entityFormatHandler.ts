import { generateEntityClassNames, parseEntityClassName } from '../../domUtils/entityUtils';
import type { EntityInfoFormat, IdFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const ONE_HUNDRED_PERCENT = '100%';

/**
 * @internal
 */
export const entityFormatHandler: FormatHandler<EntityInfoFormat & IdFormat> = {
    parse: (format, element) => {
        let isEntity = false;

        element.classList.forEach(name => {
            isEntity = parseEntityClassName(name, format) || isEntity;
        });

        if (!isEntity) {
            format.isFakeEntity = true;
            format.isReadonly = !element.isContentEditable;
        }
    },

    apply: (format, element) => {
        if (!format.isFakeEntity) {
            element.className = generateEntityClassNames(format);
        }

        if (format.isReadonly) {
            element.contentEditable = 'false';
        } else {
            element.removeAttribute('contenteditable');
        }

        if (format.isBlock && element.style.width != ONE_HUNDRED_PERCENT) {
            element.style.width = ONE_HUNDRED_PERCENT;
        }
    },
};
