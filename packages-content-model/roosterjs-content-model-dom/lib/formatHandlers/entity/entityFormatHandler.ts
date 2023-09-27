import { applyEntityClasses, parseEntityClasses } from '../../domUtils/entityUtils';
import { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import { FormatHandler } from '../FormatHandler';

export const entityFormatHandler: FormatHandler<ContentModelEntityFormat> = {
    parse: (format, element) => {
        Object.assign(format, parseEntityClasses(element));
    },

    apply: (format, element) => {
        applyEntityClasses(element, format);
    },
};
