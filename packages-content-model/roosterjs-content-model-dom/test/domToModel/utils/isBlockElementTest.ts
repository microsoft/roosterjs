import { isBlockElement } from '../../../lib/domToModel/utils/isBlockElement';

describe('isBlockElement', () => {
    it('Empty DIV', () => {
        const div = document.createElement('div');
        const result = isBlockElement(div);
        expect(result).toBeTrue();
    });

    it('Empty Table', () => {
        const table = document.createElement('table');
        const result = isBlockElement(table);
        expect(result).toBeTrue();
    });

    it('Empty TD', () => {
        const td = document.createElement('td');
        const result = isBlockElement(td);
        expect(result).toBeTrue();
    });

    it('Empty LI', () => {
        const li = document.createElement('li');
        const result = isBlockElement(li);
        expect(result).toBeTrue();
    });

    it('Inline div', () => {
        const div = document.createElement('div');
        div.style.display = 'inline';
        const result = isBlockElement(div);
        expect(result).toBeFalse();
    });

    it('Table div', () => {
        const div = document.createElement('div');
        div.style.display = 'table';
        const result = isBlockElement(div);
        expect(result).toBeTrue();
    });

    it('TableCell div', () => {
        const div = document.createElement('div');
        div.style.display = 'table-cell';
        const result = isBlockElement(div);
        expect(result).toBeTrue();
    });

    it('Inline span', () => {
        const span = document.createElement('span');
        const result = isBlockElement(span);
        expect(result).toBeFalse();
    });

    it('Block span', () => {
        const span = document.createElement('span');
        span.style.display = 'block';
        const result = isBlockElement(span);
        expect(result).toBeTrue();
    });

    it('display = flex', () => {
        const div = document.createElement('div');
        div.style.display = 'flex';

        const result = isBlockElement(div);
        expect(result).toBeTrue();
    });
});
