import { DarkModeDatasetNames } from 'roosterjs-editor-types/lib';
import { DatasetFormat } from '../../publicTypes/format/formatParts/DatasetFormat';
import { FormatHandler } from '../FormatHandler';
import { getObjectKeys } from 'roosterjs-editor-dom';

// These keys of dataset should be ignored by this format handler because they will be taken care by other format handlers
const DatasetNameToIgnore: (string | number)[] = [
    DarkModeDatasetNames.OriginalAttributeBackgroundColor,
    DarkModeDatasetNames.OriginalAttributeColor,
    DarkModeDatasetNames.OriginalStyleBackgroundColor,
    DarkModeDatasetNames.OriginalStyleColor,
];

/**
 * @internal
 */
export const datasetFormatHandler: FormatHandler<DatasetFormat> = {
    parse: (format, element) => {
        const dataset = element.dataset;

        getObjectKeys(dataset).forEach(key => {
            if (DatasetNameToIgnore.indexOf(key) < 0) format[key] = dataset[key] || '';
        });
    },

    apply: (format, element) => {
        getObjectKeys(format).forEach(key => {
            element.dataset[key] = format[key];
        });
    },
};
