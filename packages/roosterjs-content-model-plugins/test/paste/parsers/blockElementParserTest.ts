import { blockElementParser } from '../../../lib/paste/parsers/blockElementParser';
import { ContentModelBlockFormat, DomToModelContext } from 'roosterjs-content-model-types';

describe('blockElementParser', () => {
    let format: ContentModelBlockFormat;
    let element: HTMLElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        element = document.createElement('div');
        context = {} as any;
    });

    it('No background color in element style', () => {
        blockElementParser(format, element, context, {});
        expect(format).toEqual({});
    });

    it('Background color exists in element style', () => {
        element.style.backgroundColor = 'red';
        blockElementParser(format, element, context, {});
        expect(format).toEqual({});
    });
});
