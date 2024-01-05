import { tableBorderParser } from '../../../lib/paste/utils/parsers/tableBorderParser';

describe('tableBorderParser |', () => {
    it('set border styles', () => {
        const table = document.createElement('table');
        table.style.borderTopStyle = 'solid';
        table.style.borderTopWidth = '1px';

        table.style.borderRightStyle = 'solid';
        table.style.borderRightWidth = '1px';

        table.style.borderBottomStyle = 'solid';
        table.style.borderBottomWidth = '1px';

        table.style.borderLeftStyle = 'solid';
        table.style.borderLeftWidth = '1px';

        const format: any = {};
        tableBorderParser(format, table, <any>{}, <any>{});

        expect(format.borderTop).toEqual('1px solid');
        expect(format.borderRight).toEqual('1px solid');
        expect(format.borderBottom).toEqual('1px solid');
        expect(format.borderLeft).toEqual('1px solid');
    });

    it('set needed borders', () => {
        const table = document.createElement('table');
        table.style.borderTopStyle = 'solid';
        table.style.borderTopWidth = '1px';

        table.style.borderRightStyle = 'solid';
        table.style.borderRightWidth = '1px';

        table.style.borderBottomStyle = 'solid';
        table.style.borderBottomWidth = '1px';

        table.style.borderLeftStyle = 'solid';
        table.style.borderLeftWidth = '1px';

        const format: any = {
            borderTop: '2px dotted',
            borderBottom: '2px dotted',
        };
        tableBorderParser(format, table, <any>{}, <any>{});

        expect(format.borderTop).toEqual('2px dotted');
        expect(format.borderRight).toEqual('1px solid');
        expect(format.borderBottom).toEqual('2px dotted');
        expect(format.borderLeft).toEqual('1px solid');
    });
});
