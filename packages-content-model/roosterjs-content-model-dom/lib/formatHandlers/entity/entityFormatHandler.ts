import { applyEntityClasses, parseEntityClasses } from '../../domUtils/entityUtils';
import type { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const entityFormatHandler: FormatHandler<ContentModelEntityFormat> = {
    parse: (format, element) => {
        Object.assign(format, parseEntityClasses(element));
    },

    apply: (format, element) => {
        applyEntityClasses(element, format);
    },
};
