import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { FormatParser } from '../../../lib/publicTypes/context/DomToModelSettings';
import { parseFormat } from '../../../lib/domToModel/utils/parseFormat';

describe('parseFormat', () => {
    it('empty handlers', () => {
        const element = document.createElement('div');
        const format = {};
        const defaultContext = createDomToModelContext();
        parseFormat(element, [], format, defaultContext);

        expect(format).toEqual({});
    });

    it('one handlers', () => {
        const element = document.createElement('div');
        const defaultContext = createDomToModelContext();
        const parser: FormatParser<any> = (format, e, c) => {
            expect(e).toBe(element);
            expect(c).toBe(defaultContext);

            format.id = '1';
        };
        const handlers = [parser];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ id: '1' });
    });
});

describe('Default styles', () => {
    function runTest(tag: string, expectResult: Partial<CSSStyleDeclaration>) {
        const element = document.createElement(tag);
        const defaultContext = createDomToModelContext();
        const parser: FormatParser<any> = (format, e, c, defaultStyle) => {
            expect(defaultStyle).toEqual(expectResult);
            expect(c).toBe(defaultContext);

            format.id = '1';
        };
        const handlers = [parser];
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

    it('Default style for A with href', () => {
        const element = document.createElement('a');
        const defaultContext = createDomToModelContext();
        const segmentFormat = {};
        const linkFormat = {};

        element.href = 'http://test.com';

        parseFormat(element, defaultContext.formatParsers.segment, segmentFormat, defaultContext);
        parseFormat(element, defaultContext.formatParsers.link, linkFormat, defaultContext);

        expect(segmentFormat).toEqual({});
        expect(linkFormat).toEqual({
            href: 'http://test.com',
        });
    });

    it('Default style for A without href', () => {
        const element = document.createElement('a');
        const defaultContext = createDomToModelContext();
        const segmentFormat = {};
        const linkFormat = {};

        parseFormat(element, defaultContext.formatParsers.segment, segmentFormat, defaultContext);
        parseFormat(element, defaultContext.formatParsers.link, linkFormat, defaultContext);

        expect(segmentFormat).toEqual({});
        expect(linkFormat).toEqual({});
    });
});
