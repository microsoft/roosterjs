import { DatasetFormat } from 'roosterjs-content-model-types';
import { FormatHandler } from '../FormatHandler';
import { keysOf } from '../../domUtils/keysOf';

/**
 * @internal
 */
export const datasetFormatHandler: FormatHandler<DatasetFormat> = {
    parse: (format, element) => {
        const dataset = element.dataset;

        keysOf(dataset).forEach(key => {
            format[key] = dataset[key] || '';
        });
    },

    apply: (format, element) => {
        keysOf(format).forEach(key => {
            element.dataset[key] = format[key];
        });
    },
};
