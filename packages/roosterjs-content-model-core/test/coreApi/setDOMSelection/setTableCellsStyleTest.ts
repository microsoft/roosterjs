import { setTableCellsStyle } from '../../../lib/coreApi/setDOMSelection/setTableCellsStyle';
import {
    EditorCore,
    ParsedTable,
    ParsedTableCell,
    TableCellCoordinate,
} from 'roosterjs-content-model-types';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';
const DEFAULT_SELECTION_COLOR = '#C6C6C6';
const DEFAULT_SELECTION_COLOR_DARK = '#666666';

describe('setTableCellsStyle', () => {
    let core: EditorCore;
    let setEditorStyleSpy: jasmine.Spy;

    beforeEach(() => {
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');
        core = {
            api: {
                setEditorStyle: setEditorStyleSpy,
            },
            lifecycle: {
                isDarkMode: false,
            },
            selection: {
                tableCellSelectionBackgroundColor: DEFAULT_SELECTION_COLOR,
                tableCellSelectionBackgroundColorDark: DEFAULT_SELECTION_COLOR_DARK,
            },
        } as any;
    });

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
            const parsedRow: ParsedTableCell[] = [];

            for (let j = 0; j < row.cells.length; j++) {
                parsedRow.push(row.cells[j]);
            }

            parsedTable.push(parsedRow);
        }

        return parsedTable;
    }

    it('should apply style to a single cell', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 0 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
            ]
        );
    });

    it('should apply style to multiple cells in a row', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td><td>C1</td></tr>
                    <tr><td>A2</td><td>B2</td><td>C2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 2 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3) *',
            ]
        );
    });

    it('should apply style to multiple cells in a column', () => {
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
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 2, col: 0 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(1) *',
                '#testTable>TBODY> tr:nth-child(3)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(3)>TD:nth-child(1) *',
            ]
        );
    });

    it('should apply style to a rectangular selection', () => {
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
        const firstCell: TableCellCoordinate = { row: 0, col: 1 };
        const lastCell: TableCellCoordinate = { row: 1, col: 2 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(3) *',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(2)',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(2) *',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(3)',
                '#testTable>TBODY> tr:nth-child(2)>TD:nth-child(3) *',
            ]
        );
    });

    it('should use table selector for full table selection', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 1, col: 1 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            ['#testTable', '#testTable *']
        );
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
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 0, col: 1 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(1)',
                '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(1) *',
                '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(2)',
                '#testTable>THEAD> tr:nth-child(1)>TH:nth-child(2) *',
            ]
        );
    });

    it('should handle table with thead, tbody and tfoot - select from tbody', () => {
        const table = document.createElement('table');
        table.id = 'testTable';

        const thead = document.createElement('thead');
        const theadRow = document.createElement('tr');
        theadRow.innerHTML = '<th>H1</th><th>H2</th>';
        thead.appendChild(theadRow);

        const tbody = document.createElement('tbody');
        const tbodyRow = document.createElement('tr');
        tbodyRow.innerHTML = '<td>A1</td><td>B1</td>';
        tbody.appendChild(tbodyRow);

        const tfoot = document.createElement('tfoot');
        const tfootRow = document.createElement('tr');
        tfootRow.innerHTML = '<td>F1</td><td>F2</td>';
        tfoot.appendChild(tfootRow);

        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);

        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 1, col: 0 };
        const lastCell: TableCellCoordinate = { row: 1, col: 1 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            [
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(1) *',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#testTable>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
            ]
        );
    });

    it('should use dark mode color when isDarkMode is true', () => {
        core.lifecycle.isDarkMode = true;
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 1, col: 1 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR_DARK}!important;`,
            ['#testTable', '#testTable *']
        );
    });

    it('should handle selection outside table bounds', () => {
        const table = createTable(`
            <table id="testTable">
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 5, col: 5 };
        const lastCell: TableCellCoordinate = { row: 6, col: 6 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            `background-color:${DEFAULT_SELECTION_COLOR}!important;`,
            []
        );
    });

    it('should generate unique id for table without id', () => {
        const table = createTable(`
            <table>
                <tbody>
                    <tr><td>A1</td><td>B1</td></tr>
                    <tr><td>A2</td><td>B2</td></tr>
                </tbody>
            </table>
        `);
        const parsedTable = createParsedTable(table);
        const firstCell: TableCellCoordinate = { row: 0, col: 0 };
        const lastCell: TableCellCoordinate = { row: 1, col: 1 };

        setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);

        expect(setEditorStyleSpy).toHaveBeenCalled();
        expect(table.id).toBeTruthy();
        expect(table.id.startsWith('table')).toBeTrue();
    });
});
