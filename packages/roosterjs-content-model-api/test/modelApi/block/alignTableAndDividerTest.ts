import { alignTableAndDivider } from '../../../lib/modelApi/block/alignTableAndDivider';
import { createTable } from 'roosterjs-content-model-dom';

describe('alignTableAndDivider', () => {
    it('Align table to left', () => {
        const table = createTable(1);

        alignTableAndDivider(table, 'alignLeft');

        expect(table.format).toEqual({
            marginRight: 'auto',
            marginLeft: '',
        });
    });

    it('Align table to center', () => {
        const table = createTable(1);

        alignTableAndDivider(table, 'alignCenter');

        expect(table.format).toEqual({
            marginLeft: 'auto',
            marginRight: 'auto',
        });
    });

    it('Align table to right', () => {
        const table = createTable(1);

        alignTableAndDivider(table, 'alignRight');

        expect(table.format).toEqual({
            marginLeft: 'auto',
            marginRight: '',
        });
    });

    it('Align table to left to a table already has margin', () => {
        const table = createTable(1);
        table.format.marginTop = '10px';
        table.format.marginRight = '10px';
        table.format.marginBottom = '10px';
        table.format.marginLeft = '10px';

        alignTableAndDivider(table, 'alignRight');

        expect(table.format).toEqual({
            marginTop: '10px',
            marginRight: '',
            marginBottom: '10px',
            marginLeft: 'auto',
        });
    });

    it('Align table to left, check cached table and align is cleared', () => {
        const table = createTable(1);

        table.format.textAlign = 'start';
        table.format.htmlAlign = 'end';

        alignTableAndDivider(table, 'alignRight');

        expect(table.format).toEqual({
            marginRight: '',
            marginLeft: 'auto',
            textAlign: 'start',
            htmlAlign: 'end',
        });
    });
});
