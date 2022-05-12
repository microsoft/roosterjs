import { getMetadata, setMetadata } from '../metadata/metadata';
import { TableFormat } from 'roosterjs-editor-types';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from '../metadata/definitionCreators';

const TableFormatMetadata = createObjectDefinition<Required<TableFormat>>(
    {
        topBorderColor: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        bottomBorderColor: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        verticalBorderColor: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        hasHeaderRow: createBooleanDefinition(false /** isOptional */),
        headerRowColor: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        hasFirstColumn: createBooleanDefinition(false /** isOptional */),
        hasBandedColumns: createBooleanDefinition(false /** isOptional */),
        hasBandedRows: createBooleanDefinition(false /** isOptional */),
        bgColorEven: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        bgColorOdd: createStringDefinition(
            false /** isOptional */,
            undefined /** value */,
            true /** allowNull */
        ),
        tableBorderFormat: createNumberDefinition(
            false /** isOptional */,
            undefined /* value */,
            0,
            7
        ),
        keepCellShade: createBooleanDefinition(false /** isOptional */),
    },
    false /* isOptional */,
    true /** allowNull */
);

/**
 * @internal
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
