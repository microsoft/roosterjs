import { alignTable } from '../../../lib/modelApi/table/alignTable';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { TableOperation } from 'roosterjs-editor-types';

describe('alignTable', () => {
    it('Align table to left', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignLeft);

        expect(table.format).toEqual({
            marginLeft: '',
            marginRight: 'auto',
        });
    });

    it('Align table to center', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignCenter);

        expect(table.format).toEqual({
            marginLeft: 'auto',
            marginRight: 'auto',
        });
    });

    it('Align table to right', () => {
        const table = createTable(1);

        alignTable(table, TableOperation.AlignRight);

        expect(table.format).toEqual({
            marginLeft: 'auto',
            marginRight: '',
        });
    });
});
