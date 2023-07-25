import * as isWholeTableSelectedFile from '../../lib/table/isWholeTableSelected';
import VTable from '../../lib/table/VTable';

describe('isWholeTableSelectedTest', () => {
    it('Table without rows', () => {
        const table = document.createElement('table');
        spyOn(isWholeTableSelectedFile, 'default').and.callThrough();

        const vTable = new VTable(table);
        const result = isWholeTableSelectedFile.default(vTable, {
            firstCell: {
                x: 0,
                y: 0,
            },
            lastCell: {
                x: 0,
                y: 0,
            },
        });

        expect(result).toBeFalse();
        expect(isWholeTableSelectedFile.default).not.toThrow();
    });

    it('Table with single row and no cells', () => {
        const table = document.createElement('table');
        table.appendChild(document.createElement('tr'));
        spyOn(isWholeTableSelectedFile, 'default').and.callThrough();

        const vTable = new VTable(table);
        const result = isWholeTableSelectedFile.default(vTable, {
            firstCell: {
                x: 0,
                y: 0,
            },
            lastCell: {
                x: 0,
                y: 0,
            },
        });

        expect(result).toBeFalse();
        expect(isWholeTableSelectedFile.default).not.toThrow();
    });

    it('Table 1x2 is whole selected', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        tr.append(document.createElement('td'), document.createElement('td'));
        table.appendChild(tr);
        spyOn(isWholeTableSelectedFile, 'default').and.callThrough();

        const vTable = new VTable(table);
        const result = isWholeTableSelectedFile.default(vTable, {
            firstCell: {
                x: 0,
                y: 0,
            },
            lastCell: {
                x: 1,
                y: 0,
            },
        });

        expect(result).toBeTrue();
        expect(isWholeTableSelectedFile.default).not.toThrow();
    });

    it('Table 1x2 is not whole selected', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        tr.append(document.createElement('td'), document.createElement('td'));
        table.appendChild(tr);
        spyOn(isWholeTableSelectedFile, 'default').and.callThrough();

        const vTable = new VTable(table);
        const result = isWholeTableSelectedFile.default(vTable, {
            firstCell: {
                x: 0,
                y: 0,
            },
            lastCell: {
                x: 0,
                y: 0,
            },
        });

        expect(result).toBeFalse();
        expect(isWholeTableSelectedFile.default).not.toThrow();
    });
});
