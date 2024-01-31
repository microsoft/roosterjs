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
});
