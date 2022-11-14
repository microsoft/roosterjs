import { DatasetFormat } from '../../publicTypes/format/formatParts/DatasetFormat';
import { FormatHandler } from '../FormatHandler';
import { getObjectKeys } from 'roosterjs-editor-dom';

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
