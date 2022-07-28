import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { createBooleanDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { createMetadataFormatHandler } from './common/metadataFormatHandler';
import { FormatHandler } from './FormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { textAlignFormatHandler } from './common/textAlignFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';
import {
    ContentModelTableCellFormat,
    TableCellFormat,
} from '../publicTypes/format/ContentModelTableCellFormat';

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
export const TableCellFormatHandlers: FormatHandler<ContentModelTableCellFormat>[] = [
    sizeFormatHandler,
    borderFormatHandler,
    backgroundColorFormatHandler,
    textAlignFormatHandler,
    verticalAlignFormatHandler,
    createMetadataFormatHandler<TableCellFormat>(TableCellFormatDefinition),
];
