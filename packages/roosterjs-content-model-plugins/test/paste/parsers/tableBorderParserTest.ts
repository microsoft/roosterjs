import { ContentModelTableCellFormat, DomToModelContext } from 'roosterjs-content-model-types';
import { tableBorderParser } from '../../../lib/paste/parsers/tableBorderParser';

describe('tableBorderParser', () => {
    let format: ContentModelTableCellFormat;
    let element: HTMLElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        context = {} as any;
    });

    it('No border in format', () => {
        element.style.borderTopWidth = '2px';
        element.style.borderTopStyle = 'solid';

        tableBorderParser(format, element, context, {});
        expect(format).toEqual({
            borderTop: '2px solid',
        });
    });

    it('Border color exists in element style', () => {
        element.style.borderTopWidth = '2px';
        element.style.borderTopStyle = 'solid';
        element.style.borderTopColor = 'red';
        tableBorderParser(format, element, context, {});
        expect(format).toEqual({});
    });

    it('Border already exists in format', () => {
        format.borderTop = '1px dashed blue';
        element.style.borderTopWidth = '2px';
        element.style.borderTopStyle = 'solid';
        tableBorderParser(format, element, context, {});
        expect(format).toEqual({
            borderTop: '1px dashed blue',
        });
    });
});
