import { buildTableSelectors } from '../../../lib/coreApi/setDOMSelection/setTableCellsStyle';
import { ParsedTable, TableCellCoordinate } from 'roosterjs-content-model-types';

describe('buildTableSelectors', () => {
    function createTable(html: string): HTMLTableElement {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.querySelector('table') as HTMLTableElement;
    }

    function createParsedTable(table: HTMLTableElement): ParsedTable {
        const parsedTable: ParsedTable = [];
        const rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const parsedRow: (HTMLTableCellElement | null)[] = [];

            for (let j = 0; j < row.cells.length; j++) {
                parsedRow.push(row.cells[j]);
            }

            parsedTable.push(parsedRow);
        }

        return parsedTable;
    }

    it('should build selectors for a single cell', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 0 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
        ]);
    });

    it('should build selectors for multiple cells in a row', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td><td>C1</td></tr>
                    <tr><td>A2</td><td>B2</td><td>C2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 2 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3) *',
        ]);
    });

    it('should build selectors for multiple cells in a column', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                    <tr><td>A3</td><td>B3</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 2, col: 0 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(1)',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(1) *',
            '#testTable>TBODY> tr:nth-child(3)>TD:nth-child(1)',
            '#testTable>TBODY> tr:nth-child(3)>TD:nth-child(1) *',
        ]);
    });

    it('should build selectors for a rectangular selection', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td><td>C1</td></tr>
                    <tr><td>A2</td><td>B2</td><td>C2</td></tr>
                    <tr><td>A3</td><td>B3</td><td>C3</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 1 };
        const lastCell: TableCellCoordinate = { row: 1, col: 2 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3)',
            '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3) *',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(2)',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(2) *',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(3)',
            '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(3) *',
        ]);
    });

    it('should handle table with thead and tbody', () => {
        const table = createTable(`
            <table id="testTable">
                <thead>
                    <tr><th>H1</th><th>H2</th></tr>
                </thead>
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 1 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(1)',
            '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(1) *',
            '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(2)',
            '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(2) *',
        ]);
    });

    it('should handle table with thead, tbody and tfoot', () => {
        const table = createTable(`
            <table id="testTable">
                <thead>
                    <tr><th>H1</th><th>H2</th></tr>
                </thead>
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                </tbody>
                <tfoot>
                    <tr><td>F1</td><td>F2</td></tr>
                </tfoot>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 2, col: 0 };
        const lastCell: TableCellCoordinate = { row: 2, col: 1 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([
            '#testTable>TFOOT> tr:nth-child(1)>TD:nth-child(1)',
            '#testTable>TFOOT> tr:nth-child(1)>TD:nth-child(1) *',
            '#testTable>TFOOT> tr:nth-child(1)>TD:nth-child(2)',
            '#testTable>TFOOT> tr:nth-child(1)>TD:nth-child(2) *',
        ]);
    });

    it('should return empty array when selection is outside table bounds', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 5, col: 5 };
        const lastCell: TableCellCoordinate = { row: 6, col: 6 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        expect(result).toEqual([]);
    });

    it('should handle table without tbody wrapper', () => {
        const table = createTable(`
            <table id="testTable">
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const tableSelector = '#testTable';
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 1, col: 1 };

        const result = buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

        // When there's no tbody, the browser may add one automatically
        // The selector should still work
        expect(result.length).toBeGreaterThan(0);
    });
});
