import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { createMetadataFormatHandler } from '../utils/createMetadataFormatHandler';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';

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
export const tableCellMetadataFormatHandler = createMetadataFormatHandler<TableCellMetadataFormat>(
    TableCellMetadataFormatDefinition,
    format => ({
        bgColorOverride: format.bgColorOverride,
    })
);
