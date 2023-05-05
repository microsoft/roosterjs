import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { isBlockElement } from '../../../lib/domToModel/utils/isBlockElement';

describe('isBlockElement', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Empty DIV', () => {
        const div = document.createElement('div');
        const result = isBlockElement(div, context);
        expect(result).toBeTrue();
    });

    it('Empty Table', () => {
        const table = document.createElement('table');
        const result = isBlockElement(table, context);
        expect(result).toBeTrue();
    });

    it('Empty TD', () => {
        const td = document.createElement('td');
        const result = isBlockElement(td, context);
        expect(result).toBeTrue();
    });

    it('Empty LI', () => {
        const li = document.createElement('li');
        const result = isBlockElement(li, context);
        expect(result).toBeTrue();
    });

    it('Inline div', () => {
        const div = document.createElement('div');
        div.style.display = 'inline';
        const result = isBlockElement(div, context);
        expect(result).toBeFalse();
    });

    it('Table div', () => {
        const div = document.createElement('div');
        div.style.display = 'table';
        const result = isBlockElement(div, context);
        expect(result).toBeTrue();
    });

    it('TableCell div', () => {
        const div = document.createElement('div');
        div.style.display = 'table-cell';
        const result = isBlockElement(div, context);
        expect(result).toBeTrue();
    });

    it('Inline span', () => {
        const span = document.createElement('span');
        const result = isBlockElement(span, context);
        expect(result).toBeFalse();
    });

    it('Block span', () => {
        const span = document.createElement('span');
        span.style.display = 'block';
        const result = isBlockElement(span, context);
        expect(result).toBeTrue();
    });

    it('Override DIV default style', () => {
        const div = document.createElement('div');

        context = createDomToModelContext(undefined, {
            defaultStyleOverride: {
                div: {
                    display: 'inline',
                },
            },
        });

        const result = isBlockElement(div, context);
        expect(result).toBeFalse();
    });

    it('Override SPAN default style', () => {
        const span = document.createElement('span');

        context = createDomToModelContext(undefined, {
            defaultStyleOverride: {
                span: {
                    display: 'block',
                },
            },
        });

        const result = isBlockElement(span, context);
        expect(result).toBeTrue();
    });

    it('Double override SPAN', () => {
        const span = document.createElement('span');
        span.style.display = 'inline';

        context = createDomToModelContext(undefined, {
            defaultStyleOverride: {
                span: {
                    display: 'block',
                },
            },
        });

        const result = isBlockElement(span, context);
        expect(result).toBeFalse();
    });

    it('display = flex', () => {
        const div = document.createElement('div');
        div.style.display = 'flex';

        context = createDomToModelContext(undefined);

        const result = isBlockElement(div, context);
        expect(result).toBeTrue();
    });
});
