import { preprocessTable } from '../../../lib/domUtils/selection/preprocessTable';
import {
    createTable,
    createTableCell,
    createTableRow,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('preprocessTable', () => {
    it('should remove unselected cells from table rows', () => {
        const table = createTable(2);

        // First row: selected and unselected cells
        const row1 = createTableRow();
        const cell1 = createTableCell();
        const cell2 = createTableCell();
        const cell3 = createTableCell();

        cell1.isSelected = true;
        cell2.isSelected = false;
        cell3.isSelected = true;

        row1.cells.push(cell1, cell2, cell3);

        // Second row: all unselected cells
        const row2 = createTableRow();
        const cell4 = createTableCell();
        const cell5 = createTableCell();

        cell4.isSelected = false;
        cell5.isSelected = false;

        row2.cells.push(cell4, cell5);

        // Third row: all selected cells
        const row3 = createTableRow();
        const cell6 = createTableCell();
        const cell7 = createTableCell();

        cell6.isSelected = true;
        cell7.isSelected = true;

        row3.cells.push(cell6, cell7);

        table.rows = [row1, row2, row3];
        table.widths = [100, 150, 200];
        table.format.width = '450px';

        preprocessTable(table);

        // Should keep only rows with selected cells
        expect(table.rows.length).toBe(2);

        // First row should have only selected cells
        expect(table.rows[0].cells.length).toBe(2);
        expect(table.rows[0].cells[0]).toBe(cell1);
        expect(table.rows[0].cells[1]).toBe(cell3);

        // Second row (was third) should have all cells
        expect(table.rows[1].cells.length).toBe(2);
        expect(table.rows[1].cells[0]).toBe(cell6);
        expect(table.rows[1].cells[1]).toBe(cell7);

        // Width format should be removed
        expect(table.format.width).toBeUndefined();
    });

    it('should handle table with no selected cells', () => {
        const table = createTable(1);
        const row = createTableRow();
        const cell = createTableCell();

        cell.isSelected = false;
        row.cells.push(cell);
        table.rows = [row];
        table.widths = [100];

        preprocessTable(table);

        expect(table.rows.length).toBe(0);
        expect(table.widths.length).toBe(0);
    });

    it('should handle empty table', () => {
        const table = createTable(0);
        table.widths = [];

        preprocessTable(table);

        expect(table.rows.length).toBe(0);
        expect(table.widths.length).toBe(0);
    });

    it('should filter widths based on selected columns', () => {
        const table = createTable(1);
        const row = createTableRow();

        // Create cells for columns 0, 1, 2, 3, 4
        const cells = [];
        for (let i = 0; i < 5; i++) {
            const cell = createTableCell();
            cell.isSelected = i >= 1 && i <= 3; // Select columns 1, 2, 3
            cells.push(cell);
        }

        row.cells.push(...cells);
        table.rows = [row];
        table.widths = [100, 150, 200, 250, 300]; // 5 widths

        preprocessTable(table);

        // Should keep only selected cells (columns 1, 2, 3)
        expect(table.rows[0].cells.length).toBe(3);

        // Should keep widths for columns 1, 2, 3
        expect(table.widths.length).toBe(3);
        expect(table.widths).toEqual([150, 200, 250]);
    });

    it('should handle table with no selected columns (widths becomes empty)', () => {
        const table = createTable(1);
        const row = createTableRow();
        const cell = createTableCell();

        cell.isSelected = false;
        row.cells.push(cell);
        table.rows = [row];
        table.widths = [100, 150, 200];

        preprocessTable(table);

        expect(table.widths.length).toBe(0);
    });

    it('should preserve table format except width', () => {
        const table = createTable(1);
        const row = createTableRow();
        const cell = createTableCell();

        cell.isSelected = true;
        row.cells.push(cell);
        table.rows = [row];

        table.format = {
            width: '400px',
            backgroundColor: 'red',
            borderTop: '1px solid blue',
            marginTop: '10px',
        };

        preprocessTable(table);

        expect(table.format.width).toBeUndefined();
        expect(table.format.backgroundColor).toBe('red');
        expect(table.format.borderTop).toBe('1px solid blue');
        expect(table.format.marginTop).toBe('10px');
    });

    it('should handle complex selection pattern', () => {
        const table = createTable(3);

        // Create a 3x4 table with complex selection
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            const row = createTableRow();
            for (let colIndex = 0; colIndex < 4; colIndex++) {
                const cell = createTableCell();
                const para = createParagraph();
                const text = createText(`R${rowIndex}C${colIndex}`);

                para.segments.push(text);
                cell.blocks.push(para);

                // Select cells in a checkerboard pattern
                cell.isSelected = (rowIndex + colIndex) % 2 === 0;
                row.cells.push(cell);
            }
            table.rows[rowIndex] = row;
        }

        table.widths = [100, 150, 200, 250];

        preprocessTable(table);

        // All rows should remain (each has at least one selected cell)
        expect(table.rows.length).toBe(3);

        // Each row should have 2 selected cells (checkerboard pattern)
        expect(table.rows[0].cells.length).toBe(2); // Columns 0, 2
        expect(table.rows[1].cells.length).toBe(2); // Columns 1, 3
        expect(table.rows[2].cells.length).toBe(2); // Columns 0, 2

        // Check content of selected cells
        expect((table.rows[0].cells[0].blocks[0] as any).segments[0].text).toBe('R0C0');
        expect((table.rows[0].cells[1].blocks[0] as any).segments[0].text).toBe('R0C2');
        expect((table.rows[1].cells[0].blocks[0] as any).segments[0].text).toBe('R1C1');
        expect((table.rows[1].cells[1].blocks[0] as any).segments[0].text).toBe('R1C3');
    });

    it('should handle table with mixed row selections', () => {
        const table = createTable(4);

        // Row 0: no selected cells
        const row0 = createTableRow();
        row0.cells.push(createTableCell(), createTableCell());
        row0.cells.forEach(cell => (cell.isSelected = false));

        // Row 1: some selected cells
        const row1 = createTableRow();
        const cell1a = createTableCell();
        const cell1b = createTableCell();
        const cell1c = createTableCell();
        cell1a.isSelected = true;
        cell1b.isSelected = false;
        cell1c.isSelected = true;
        row1.cells.push(cell1a, cell1b, cell1c);

        // Row 2: all selected cells
        const row2 = createTableRow();
        const cell2a = createTableCell();
        const cell2b = createTableCell();
        cell2a.isSelected = true;
        cell2b.isSelected = true;
        row2.cells.push(cell2a, cell2b);

        // Row 3: no selected cells
        const row3 = createTableRow();
        row3.cells.push(createTableCell());
        row3.cells[0].isSelected = false;

        table.rows = [row0, row1, row2, row3];
        table.widths = [100, 150, 200];

        preprocessTable(table);

        // Should keep only rows 1 and 2 (rows with selected cells)
        expect(table.rows.length).toBe(2);

        // Row 1 should have 2 selected cells
        expect(table.rows[0].cells.length).toBe(2);
        expect(table.rows[0].cells[0]).toBe(cell1a);
        expect(table.rows[0].cells[1]).toBe(cell1c);

        // Row 2 should have 2 selected cells
        expect(table.rows[1].cells.length).toBe(2);
        expect(table.rows[1].cells[0]).toBe(cell2a);
        expect(table.rows[1].cells[1]).toBe(cell2b);
    });
});
