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
});
