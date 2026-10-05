import { wordBorderParser } from '../../../lib/paste/WordDesktop/wordBorderParser';
import type { ContentModelTableFormat, DomToModelContext } from 'roosterjs-content-model-types';

describe('wordBorderParser', () => {
    let format: ContentModelTableFormat;
    let element: HTMLElement;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        element = document.createElement('td');
        context = {} as any;
    });

    it('clears all border formats when style attribute has border none', () => {
        format.borderTop = '1px solid';
        format.borderRight = '1px solid';
        format.borderBottom = '1px solid';
        format.borderLeft = '1px solid';
        element.setAttribute('style', 'width: 100px; border:none; padding: 0in 5.4pt 0in 5.4pt;');

        wordBorderParser(format, element, context, {});

        expect(format).toEqual({
            borderTop: '',
            borderRight: '',
            borderBottom: '',
            borderLeft: '',
        });
    });

    it('clears side border formats when style attribute has side border none', () => {
        format.borderTop = '1px solid';
        format.borderRight = '1px solid';
        format.borderBottom = '1px solid';
        format.borderLeft = '1px solid';
        element.setAttribute(
            'style',
            'border-top:none; border-right:1px solid red; border-bottom: none !important;'
        );

        wordBorderParser(format, element, context, {});

        expect(format).toEqual({
            borderTop: '',
            borderRight: '1px solid',
            borderBottom: '',
            borderLeft: '1px solid',
        });
    });

    it('respects later visible side border declarations after border none', () => {
        format.borderTop = '1px solid';
        format.borderRight = '1px solid';
        format.borderBottom = '1px solid';
        format.borderLeft = '1px solid';
        element.setAttribute('style', 'border:none; border-top: 1px solid red;');

        wordBorderParser(format, element, context, {});

        expect(format).toEqual({
            borderTop: '1px solid',
            borderRight: '',
            borderBottom: '',
            borderLeft: '',
        });
    });

    it('does not update border formats without border none in style attribute', () => {
        format.borderTop = '1px solid';
        element.setAttribute('style', 'border-top: 1px solid red;');

        wordBorderParser(format, element, context, {});

        expect(format).toEqual({
            borderTop: '1px solid',
        });
    });
});
