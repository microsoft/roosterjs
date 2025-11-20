import { wordDesktopListLevelParser } from '../../../../lib/paste/WordDesktop/parsers/wordDesktopListLevelParser';
import type {
    ContentModelListItemLevelFormat,
    DomToModelContext,
} from 'roosterjs-content-model-types';

describe('wordDesktopListLevelParser', () => {
    let format: ContentModelListItemLevelFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    let defaultStyle: Readonly<Partial<CSSStyleDeclaration>>;

    beforeEach(() => {
        format = {};
        element = document.createElement('li');
        context = {} as DomToModelContext;
        defaultStyle = {};
    });

    it('should set marginLeft from defaultStyle when element has marginLeft', () => {
        element.style.marginLeft = '20px';
        defaultStyle = { marginLeft: '10px' };

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('10px');
    });

    it('should not set marginLeft when element has no marginLeft', () => {
        element.style.marginLeft = '';
        defaultStyle = { marginLeft: '10px' };

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
    });

    it('should set marginBottom to undefined regardless of input', () => {
        format.marginBottom = '15px'; // Set initial value

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginBottom).toBeUndefined();
    });

    it('should handle empty defaultStyle marginLeft', () => {
        element.style.marginLeft = '20px';
        defaultStyle = { marginLeft: undefined };

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBeUndefined();
    });

    it('should handle multiple style properties', () => {
        element.style.marginLeft = '20px';
        format.marginBottom = '10px';
        defaultStyle = { marginLeft: '5px' };

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('5px');
        expect(format.marginBottom).toBeUndefined();
    });

    it('should handle zero marginLeft', () => {
        element.style.marginLeft = '0px';
        defaultStyle = { marginLeft: '15px' };

        wordDesktopListLevelParser(format, element, context, defaultStyle);

        expect(format.marginLeft).toBe('15px');
    });
});
