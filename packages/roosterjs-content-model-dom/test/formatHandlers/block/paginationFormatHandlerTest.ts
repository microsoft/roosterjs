import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { paginationFormatHandler } from '../../../lib/formatHandlers/block/paginationFormatHandler';
import type { PaginationFormat } from 'roosterjs-content-model-types';

describe('paginationFormatHandler', () => {
    it('does not implicitly inherit break rules onto a child block', () => {
        const format: PaginationFormat = {
            breakBefore: 'page',
            breakAfter: 'avoid',
            breakInside: 'avoid',
        };
        paginationFormatHandler.parse(
            format,
            document.createElement('p'),
            createDomToModelContext(),
            {}
        );
        expect(format).toEqual({});
    });
    it('supports explicit inheritance and initial-value resets', () => {
        const element = document.createElement('p');
        element.style.breakBefore = 'inherit';
        element.style.breakAfter = 'unset';
        const format: PaginationFormat = { breakBefore: 'page', breakAfter: 'avoid' };
        paginationFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format).toEqual({ breakBefore: 'page', breakAfter: 'auto' });
    });
    it('normalizes legacy stylesheet page breaks and applies standard CSS', () => {
        const element = document.createElement('p');
        const format: PaginationFormat = {};
        paginationFormatHandler.parse(format, element, createDomToModelContext(), {
            pageBreakBefore: 'always',
        });
        paginationFormatHandler.apply(format, element, createModelToDomContext());
        expect(element.style.breakBefore).toBe('page');
    });
});
