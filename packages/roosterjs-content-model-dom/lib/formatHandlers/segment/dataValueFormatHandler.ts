import type { DataValueFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 * Format handler for the "value" attribute of a HTML &lt;data&gt; element
 */
export const dataValueFormatHandler: FormatHandler<DataValueFormat> = {
    parse: (format, element) => {
        if (element.hasAttribute('value')) {
            format.dataValue = element.getAttribute('value') ?? '';
        }
    },
    apply: (format, element) => {
        if (format.dataValue != undefined) {
            element.setAttribute('value', format.dataValue);
        }
    },
};
