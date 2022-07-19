import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from '../FormatHandler';
import { TableFormat } from 'roosterjs-editor-types';
import {
    getMetadata,
    setMetadata,
    removeMetadata,
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from 'roosterjs-editor-dom';

const NullStringDefinition = createStringDefinition(
    false /** isOptional */,
    undefined /** value */,
    true /** allowNull */
);

const BooleanDefinition = createBooleanDefinition(false /** isOptional */);

const TableFormatMetadata = createObjectDefinition<Required<TableFormat>>(
    {
        topBorderColor: NullStringDefinition,
        bottomBorderColor: NullStringDefinition,
        verticalBorderColor: NullStringDefinition,
        hasHeaderRow: BooleanDefinition,
        headerRowColor: NullStringDefinition,
        hasFirstColumn: BooleanDefinition,
        hasBandedColumns: BooleanDefinition,
        hasBandedRows: BooleanDefinition,
        bgColorEven: NullStringDefinition,
        bgColorOdd: NullStringDefinition,
        tableBorderFormat: createNumberDefinition(
            false /** isOptional */,
            undefined /* value */,
            0 /* first table border format */,
            7 /* last table border format */
        ),
        keepCellShade: BooleanDefinition,
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
 */
export const tableMetadataHandler: FormatHandler<ContentModelTableFormat> = {
    parse: (format, element) => {
        const metadata = getMetadata(element, TableFormatMetadata);

        if (metadata) {
            format.metadata = metadata;
        }
    },
    apply: (format, element) => {
        if (format.metadata) {
            setMetadata(element, format.metadata, TableFormatMetadata);
        } else {
            removeMetadata(element);
        }
    },
};
