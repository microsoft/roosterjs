import { createHighlightHelper } from '../../../lib/findReplace/utils/HighlightHelperImpl';

describe('HighlightHelper', () => {
    let MockedHighlight: any;
    let clearSpy: jasmine.Spy;
    let addSpy: jasmine.Spy;

    beforeEach(() => {
        clearSpy = jasmine.createSpy('clear');
        addSpy = jasmine.createSpy('add');

        MockedHighlight = class {
            clear = clearSpy;
            add = addSpy;
        };
    });

    it('Create object without Highlight support', () => {
        const helper = createHighlightHelper('testKey');

        helper.initialize({} as any);

        expect(helper).not.toBeNull();
    });

    it('Create object with Highlight support', () => {
        const mockedWindow = {
            Highlight: MockedHighlight,
            CSS: {
                highlights: new Map<string, any>(),
            },
        } as any;

        const helper = createHighlightHelper('testKey');

        helper.initialize(mockedWindow);

        expect(helper).not.toBeNull();
        expect(mockedWindow.CSS.highlights.has('testKey')).toBeTrue();
        expect(clearSpy).not.toHaveBeenCalled();
        expect(addSpy).not.toHaveBeenCalled();
    });

    it('dispose', () => {
        const mockedWindow = {
            Highlight: MockedHighlight,
            CSS: {
                highlights: new Map<string, any>(),
            },
        } as any;

        const helper = createHighlightHelper('testKey');

        helper.initialize(mockedWindow);
        helper.dispose();

        expect(mockedWindow.CSS.highlights.has('testKey')).toBeFalse();
        expect(clearSpy).toHaveBeenCalled();
        expect(addSpy).not.toHaveBeenCalled();
    });

    it('addRanges', () => {
        const mockedWindow = {
            Highlight: MockedHighlight,
            CSS: {
                highlights: new Map<string, any>(),
            },
        } as any;

        const helper = createHighlightHelper('testKey');

        helper.initialize(mockedWindow);
        const range1 = 'RANGE1' as any;
        const range2 = 'RANGE2' as any;

        helper.addRanges([range1, range2]);
        expect(addSpy).toHaveBeenCalledTimes(2);
        expect(addSpy).toHaveBeenCalledWith(range1);
        expect(addSpy).toHaveBeenCalledWith(range2);
    });

    it('clear', () => {
        const mockedWindow = {
            Highlight: MockedHighlight,
            CSS: {
                highlights: new Map<string, any>(),
            },
        } as any;
        const helper = createHighlightHelper('testKey');

        helper.initialize(mockedWindow);

        helper.clear();
        expect(clearSpy).toHaveBeenCalled();
    });
});
