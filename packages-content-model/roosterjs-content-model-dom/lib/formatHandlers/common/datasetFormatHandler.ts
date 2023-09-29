import { getObjectKeys } from 'roosterjs-editor-dom';
import type { DatasetFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const datasetFormatHandler: FormatHandler<DatasetFormat> = {
    parse: (format, element) => {
        const dataset = element.dataset;

        getObjectKeys(dataset).forEach(key => {
            format[key] = dataset[key] || '';
        });
    },

    apply: (format, element) => {
        getObjectKeys(format).forEach(key => {
            element.dataset[key] = format[key];
        });
    },
};
