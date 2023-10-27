import { applyTableFormat } from '../table/applyTableFormat';
import type { ContentModelTable } from 'roosterjs-content-model-types';

export function createTablesFormat(tablesToClear: [ContentModelTable, boolean][]) {
    tablesToClear.forEach(x => {
        const [table, isWholeTableSelected] = x;
        if (isWholeTableSelected) {
            table.format = {
                useBorderBox: table.format.useBorderBox,
                borderCollapse: table.format.borderCollapse,
            };
            updateTableMetadata(table, () => null);
        }

        applyTableFormat(table, undefined /*newFormat*/, true);
    });
}
