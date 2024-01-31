import { createDOMHelper } from '../../lib/editor/DOMHelperImpl';

describe('DOMHelperImpl', () => {
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
});
