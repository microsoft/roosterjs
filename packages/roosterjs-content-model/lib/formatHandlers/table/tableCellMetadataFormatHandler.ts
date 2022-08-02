import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { createMetadataFormatHandler } from '../utils/createMetadataFormatHandler';
import { TableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';

const TableCellFormatDefinition = createObjectDefinition<Required<TableCellFormat>>(
    {
        bgColorOverride: createBooleanDefinition(true /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);
/**
 * @internal
 */
export const tableCellMetadataFormatHandler = createMetadataFormatHandler<TableCellFormat>(
    TableCellFormatDefinition
);
