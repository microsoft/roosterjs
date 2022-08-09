import { FormatHandler } from '../FormatHandler';
import { TableCellMetadataFormat } from '../../publicTypes/format/formatParts/TableCellMetadataFormat';
import {
    createBooleanDefinition,
    createObjectDefinition,
    getMetadata,
    getObjectKeys,
    removeMetadata,
    setMetadata,
} from 'roosterjs-editor-dom';

const TableCellMetadataFormatDefinition = createObjectDefinition<Required<TableCellMetadataFormat>>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);
/**
 * @internal
 */
export const tableCellMetadataFormatHandler: FormatHandler<TableCellMetadataFormat> = {
    parse: (format, element) => {
        const metadata = getMetadata(element, TableCellMetadataFormatDefinition);

        if (metadata) {
            format.bgColorOverride = metadata.bgColorOverride;
        }
    },
    apply: (format, element) => {
        const metadata = {
            bgColorOverride: format.bgColorOverride,
        };

        if (
            getObjectKeys(metadata).every(key => typeof metadata[key] === 'undefined') ||
            !setMetadata(element, metadata, TableCellMetadataFormatDefinition)
        ) {
            removeMetadata(element);
        }
    },
};
