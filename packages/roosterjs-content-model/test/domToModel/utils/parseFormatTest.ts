import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { FormatKey } from '../../../lib/publicTypes/format/FormatHandlerTypeMap';
import { parseFormat } from '../../../lib/domToModel/utils/parseFormat';

describe('parseFormat', () => {
    it('empty handlers', () => {
        const element = document.createElement('div');
        const handlers: FormatKey[] = [];
        const format = {};
        const defaultContext = createDomToModelContext();
        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({});
    });

    it('one handlers', () => {
        const element = document.createElement('div');
        const defaultContext = createDomToModelContext(undefined, undefined, {
            formatParserOverride: {
                id: (format, e, c, defaultStyle) => {
                    expect(e).toBe(element);
                    expect(c).toBe(defaultContext);

                    format.id = '1';
                },
            },
        });
        const handlers: FormatKey[] = ['id'];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ id: '1' });
    });
});

describe('Default styles', () => {
    function runTest(tag: string, expectResult: Partial<CSSStyleDeclaration>) {
        const element = document.createElement(tag);
        const defaultContext = createDomToModelContext(undefined, undefined, {
            formatParserOverride: {
                id: (format, e, c, defaultStyle) => {
                    expect(defaultStyle).toEqual(expectResult);
                    expect(c).toBe(defaultContext);

                    format.id = '1';
                },
            },
        });
        const handlers: FormatKey[] = ['id'];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ id: '1' });
    }

    it('Default style for B', () => {
        runTest('b', { fontWeight: 'bold' });
    });

    it('Default style for EM', () => {
        runTest('em', { fontStyle: 'italic' });
    });

    it('Default style for I', () => {
        runTest('i', { fontStyle: 'italic' });
    });

    it('Default style for S', () => {
        runTest('s', { textDecoration: 'line-through' });
    });

    it('Default style for STRIKE', () => {
        runTest('strike', { textDecoration: 'line-through' });
    });

    it('Default style for STRONG', () => {
        runTest('strong', { fontWeight: 'bold' });
    });

    it('Default style for U', () => {
        runTest('u', { textDecoration: 'underline' });
    });
});
