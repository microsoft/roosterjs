import { getMetadata, setMetadata } from '../metadata/metadata';
import { TableFormat } from 'roosterjs-editor-types';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from '../metadata/definitionCreators';

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
 * Get the format info of a table
 * If the table does not have a info saved, it will be retrieved from the css styles
 * @param table The table that has the info
 */
export function getTableFormatInfo(table: HTMLTableElement) {
    return getMetadata(table, TableFormatMetadata);
}

/**
 * @internal
 * Save the format info of a table
 * @param table The table the info will be saved
 * @param format The format of the table
 */
export function saveTableInfo(table: HTMLTableElement, format: TableFormat) {
    if (table && format) {
        setMetadata(table, format, TableFormatMetadata);
    }
}
