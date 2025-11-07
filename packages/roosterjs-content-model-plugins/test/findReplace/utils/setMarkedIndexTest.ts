import * as scrollRectIntoView from 'roosterjs-content-model-dom/lib/domUtils/scrollRectIntoView';
import { FindReplaceContext } from '../../../lib/findReplace/types/FindReplaceContext';
import { IEditor } from 'roosterjs-content-model-types';
import { setMarkedIndex } from '../../../lib/findReplace/utils/setMarkedIndex';

describe('setMarkedIndex', () => {
    let mockedEditor: IEditor;
    let context: FindReplaceContext;
    let scrollRectIntoViewSpy: jasmine.Spy;
    let clearSpy: jasmine.Spy;
    let addRangesSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;
    let getBoundingClientRectSpy1: jasmine.Spy;
    let getBoundingClientRectSpy2: jasmine.Spy;
    let mockedRange1: Range;
    let mockedRange2: Range;

    const mockedRect = 'RECT' as any;
    const mockedRangeRect1 = 'RANGE_RECT_1' as any;
    const mockedRangeRect2 = 'RANGE_RECT_2' as any;
    const mockedScrollContainer = 'SCROLL_CONTAINER' as any;
    const mockedDOMHelper = 'DOM_HELPER' as any;

    beforeEach(() => {
        triggerEventSpy = jasmine.createSpy('triggerEvent');
        getBoundingClientRectSpy1 = jasmine
            .createSpy('getBoundingClientRect1')
            .and.returnValue(mockedRangeRect1);
        getBoundingClientRectSpy2 = jasmine
            .createSpy('getBoundingClientRect2')
            .and.returnValue(mockedRangeRect2);
        mockedRange1 = {
            getBoundingClientRect: getBoundingClientRectSpy1,
        } as any;
        mockedRange2 = {
            getBoundingClientRect: getBoundingClientRectSpy2,
        } as any;

        mockedEditor = ({
            getVisibleViewport: () => mockedRect,
            getScrollContainer: () => mockedScrollContainer,
            getDOMHelper: () => mockedDOMHelper,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        clearSpy = jasmine.createSpy('clear');
        addRangesSpy = jasmine.createSpy('addRanges');

        context = {
            ranges: [],
            markedIndex: -1,
            scrollMargin: 10,
            replaceHighlight: {
                clear: clearSpy,
                addRanges: addRangesSpy,
            },
        } as any;
        scrollRectIntoViewSpy = spyOn(scrollRectIntoView, 'scrollRectIntoView');
    });

    it('set marked index', () => {
        context.ranges = [mockedRange1, mockedRange2];

        setMarkedIndex(mockedEditor, context, 1);

        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).toHaveBeenCalledWith([mockedRange2]);
        expect(scrollRectIntoViewSpy).toHaveBeenCalledWith(
            mockedScrollContainer,
            mockedRect,
            mockedDOMHelper,
            mockedRangeRect2,
            10,
            true
        );
        expect(context.markedIndex).toBe(1);
        expect(triggerEventSpy).toHaveBeenCalledWith('findResultChanged', {
            markedIndex: 1,
            ranges: context.ranges,
            alternativeRange: undefined,
        });
    });

    it('set marked index out of range', () => {
        context.ranges = [mockedRange1, mockedRange2];
        setMarkedIndex(mockedEditor, context, 2);

        expect(context.markedIndex).toBe(-1);
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).not.toHaveBeenCalled();
        expect(scrollRectIntoViewSpy).not.toHaveBeenCalled();
        expect(triggerEventSpy).toHaveBeenCalledWith('findResultChanged', {
            markedIndex: -1,
            ranges: context.ranges,
            alternativeRange: undefined,
        });
    });
});
