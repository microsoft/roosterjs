import { ContentModelListItemLevelFormat, DomToModelContext } from 'roosterjs-content-model-types';
import { listLevelParser } from '../../../lib/paste/parsers/listLevelParser';

describe('listLevelParser', () => {
    let format: ContentModelListItemLevelFormat;
    let element: HTMLElement;
    let context: DomToModelContext;
    let defaultStyle: Readonly<Partial<CSSStyleDeclaration>>;

    beforeEach(() => {
        format = {};
        element = document.createElement('li');
        context = {} as any;
        defaultStyle = {};
    });

    it('should set marginLeft from defaultStyle when element has marginLeft', () => {
        element.style.marginLeft = '20px';
        defaultStyle = { marginLeft: '15px' };
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBe('15px');
        expect(format.marginBottom).toBeUndefined();
    });

    it('should not set marginLeft when element marginLeft is empty', () => {
        element.style.marginLeft = '';
        defaultStyle = { marginLeft: '15px' };
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
        expect(format.marginBottom).toBeUndefined();
    });

    it('should always set marginBottom to undefined', () => {
        format.marginBottom = '10px';
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginBottom).toBeUndefined();
    });

    it('should handle undefined defaultStyle marginLeft', () => {
        element.style.marginLeft = '20px';
        defaultStyle = {};
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
        expect(format.marginBottom).toBeUndefined();
    });

    it('should preserve other format properties', () => {
        format.marginRight = '10px';
        format.marginTop = '5px';
        element.style.marginLeft = '20px';
        defaultStyle = { marginLeft: '15px' };
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginRight).toBe('10px');
        expect(format.marginTop).toBe('5px');
        expect(format.marginLeft).toBe('15px');
        expect(format.marginBottom).toBeUndefined();
    });

    it('should handle element with no marginLeft style', () => {
        defaultStyle = { marginLeft: '15px' };
        listLevelParser(format, element, context, defaultStyle);
        expect(format.marginLeft).toBeUndefined();
        expect(format.marginBottom).toBeUndefined();
    });
});
