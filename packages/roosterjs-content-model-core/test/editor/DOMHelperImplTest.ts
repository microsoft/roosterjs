import { createDOMHelper } from '../../lib/editor/DOMHelperImpl';

describe('DOMHelperImpl', () => {
    it('isNodeInEditor', () => {
        const mockedResult = 'RESULT' as any;
        const containsSpy = jasmine.createSpy('contains').and.returnValue(mockedResult);
        const mockedDiv = {
            contains: containsSpy,
        } as any;
        const domHelper = createDOMHelper(mockedDiv);
        const mockedNode = 'NODE' as any;

        const result = domHelper.isNodeInEditor(mockedNode);

        expect(result).toBe(mockedResult);
        expect(containsSpy).toHaveBeenCalledWith(mockedNode);
    });

    it('queryElements', () => {
        const mockedResult = ['RESULT'] as any;
        const querySelectorAllSpy = jasmine
            .createSpy('querySelectorAll')
            .and.returnValue(mockedResult);
        const mockedDiv: HTMLElement = {
            querySelectorAll: querySelectorAllSpy,
        } as any;
        const mockedSelector = 'SELECTOR';
        const domHelper = createDOMHelper(mockedDiv);

        const result = domHelper.queryElements(mockedSelector);

        expect(result).toEqual(mockedResult);
        expect(querySelectorAllSpy).toHaveBeenCalledWith(mockedSelector);
    });

    it('getTextContent', () => {
        const mockedTextContent = 'TEXT';
        const mockedDiv: HTMLDivElement = {
            textContent: mockedTextContent,
        } as any;
        const domHelper = createDOMHelper(mockedDiv);

        const result = domHelper.getTextContent();

        expect(result).toBe(mockedTextContent);
    });

    it('calculateZoomScale 1', () => {
        const mockedDiv = {
            getBoundingClientRect: () => ({
                width: 1,
            }),
            offsetWidth: 2,
        } as any;
        const domHelper = createDOMHelper(mockedDiv);

        const zoomScale = domHelper.calculateZoomScale();

        expect(zoomScale).toBe(0.5);
    });

    it('calculateZoomScale 2', () => {
        const mockedDiv = {
            getBoundingClientRect: () => ({
                width: 1,
            }),
            offsetWidth: 0, // Wrong number, should return 1 as fallback
        } as any;
        const domHelper = createDOMHelper(mockedDiv);

        const zoomScale = domHelper.calculateZoomScale();

        expect(zoomScale).toBe(1);
    });

    it('getDomAttribute', () => {
        const mockedAttr = 'ATTR';
        const mockedValue = 'VALUE';
        const getAttributeSpy = jasmine.createSpy('getAttribute').and.returnValue(mockedValue);
        const mockedDiv = {
            getAttribute: getAttributeSpy,
        } as any;

        const domHelper = createDOMHelper(mockedDiv);
        const result = domHelper.getDomAttribute(mockedAttr);

        expect(result).toBe(mockedValue);
        expect(getAttributeSpy).toHaveBeenCalledWith(mockedAttr);
    });

    it('setDomAttribute', () => {
        const mockedAttr1 = 'ATTR1';
        const mockedAttr2 = 'ATTR2';
        const mockedValue = 'VALUE';
        const setAttributeSpy = jasmine.createSpy('setAttribute');
        const removeAttributeSpy = jasmine.createSpy('removeAttribute');
        const mockedDiv = {
            setAttribute: setAttributeSpy,
            removeAttribute: removeAttributeSpy,
        } as any;

        const domHelper = createDOMHelper(mockedDiv);
        domHelper.setDomAttribute(mockedAttr1, mockedValue);

        expect(setAttributeSpy).toHaveBeenCalledWith(mockedAttr1, mockedValue);
        expect(removeAttributeSpy).not.toHaveBeenCalled();

        domHelper.setDomAttribute(mockedAttr2, null);
        expect(removeAttributeSpy).toHaveBeenCalledWith(mockedAttr2);
    });

    it('getDomStyle', () => {
        const mockedValue = 'COLOR' as any;
        const styleName: keyof CSSStyleDeclaration = 'backgroundColor';
        const styleSpy = jasmine.createSpyObj('style', [styleName]);
        styleSpy[styleName] = mockedValue;
        const mockedDiv = {
            style: styleSpy,
        } as any;

        const domHelper = createDOMHelper(mockedDiv);
        const result = domHelper.getDomStyle(styleName);

        expect(result).toBe(mockedValue);
    });
});
