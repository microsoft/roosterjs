import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelTableRow,
    ReadonlyContentModelBlockFormat,
    ReadonlyContentModelTableCell,
    ReadonlyContentModelTableRow,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelTableRow model
 * @param format @optional The format of this model
 */
export function createTableRow(
    format?: ReadonlyContentModelBlockFormat,
    height: number = 0,
    cells: ReadonlyContentModelTableCell[] = []
): ContentModelTableRow {
    const row: ReadonlyContentModelTableRow = {
        height: height,
        format: { ...format },
        cells: cells,
    };

    return internalConvertToMutableType(row);
}
