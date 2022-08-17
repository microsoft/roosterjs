import { alignTable } from '../../../lib/modelApi/table/alignTable';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { TableOperation } from 'roosterjs-editor-types';

describe('alignTable', () => {
    it('Align table to left', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignLeft);

        expect(table.format).toEqual({
            margin: '0 auto 0 0',
        });
    });

    it('Align table to center', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignCenter);

        expect(table.format).toEqual({
            margin: '0 auto 0 auto',
        });
    });

    it('Align table to right', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignRight);

        expect(table.format).toEqual({
            margin: '0 0 0 auto',
        });
    });

    it('Align table to left to a table already has margin', () => {
        const table = createTable(1);
        table.format.margin = '10px';

        alignTable(table, TableOperation.AlignRight);

        expect(table.format).toEqual({
            margin: '10px 0 10px auto',
        });
    });
});
