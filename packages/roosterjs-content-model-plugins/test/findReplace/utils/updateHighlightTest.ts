import * as getRangesByText from 'roosterjs-content-model-dom/lib/domUtils/getRangesByText';
import * as setMarkedIndex from '../../../lib/findReplace/utils/setMarkedIndex';
import * as sortRanges from '../../../lib/findReplace/utils/sortRanges';
import { updateHighlight } from '../../../lib/findReplace/utils/updateHighlight';

describe('updateHighlight', () => {
    let mockedEditor: any;
    let context: any;
    let setMarkedIndexSpy: jasmine.Spy;
    let getRangesByTextSpy: jasmine.Spy;
    let isNodeInEditorSpy: jasmine.Spy;
    let getRangesByTextGlobalSpy: jasmine.Spy;
    let sortRangesSpy: jasmine.Spy;

    beforeEach(() => {
        setMarkedIndexSpy = spyOn(setMarkedIndex, 'setMarkedIndex');
        getRangesByTextSpy = jasmine.createSpy('getRangesByText');
        isNodeInEditorSpy = jasmine.createSpy('isNodeInEditor').and.returnValue(true);
        sortRangesSpy = spyOn(sortRanges, 'sortRanges');
        getRangesByTextGlobalSpy = spyOn(getRangesByText, 'getRangesByText');

        mockedEditor = {
            getDOMHelper: () => ({
                getRangesByText: getRangesByTextSpy,
                isNodeInEditor: isNodeInEditorSpy,
            }),
        };
        context = {
            ranges: [],
            markedIndex: -1,
            scrollMargin: 10,
            findHighlight: {
                clear: jasmine.createSpy('clear'),
                addRanges: jasmine.createSpy('addRanges'),
            },
        };
    });

    it('not searching, reset highlight', () => {
        context.markedIndex = 0;
        context.ranges = ['RANGE1', 'RANGE2'];

        updateHighlight(mockedEditor, context);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).not.toHaveBeenCalled();
        expect(context.ranges.length).toBe(0);
        expect(sortRangesSpy).not.toHaveBeenCalled();
    });

    it('searching, no existing ranges, update highlight, no added elements, no removed elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;

        getRangesByTextSpy.and.returnValue(['RANGE1', 'RANGE2']);

        updateHighlight(mockedEditor, context);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith(['RANGE1', 'RANGE2']);
        expect(context.ranges).toEqual(['RANGE1', 'RANGE2']);
        expect(sortRangesSpy).toHaveBeenCalledWith(['RANGE1', 'RANGE2']);
    });

    it('searching, has existing ranges, update highlight, no added elements, no removed elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        context.ranges = ['RANGE1', 'RANGE2'];

        getRangesByTextSpy.and.returnValue(['RANGE3', 'RANGE4']);

        updateHighlight(mockedEditor, context);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith(['RANGE3', 'RANGE4']);
        expect(context.ranges).toEqual(['RANGE3', 'RANGE4']);
        expect(sortRangesSpy).toHaveBeenCalledWith(['RANGE3', 'RANGE4']);
    });

    it('searching, has existing ranges, update highlight, has empty added elements, has empty removed elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        context.ranges = ['RANGE1', 'RANGE2'];

        getRangesByTextSpy.and.returnValue(['RANGE3', 'RANGE4']);

        updateHighlight(mockedEditor, context, [], []);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith(['RANGE1', 'RANGE2']);
        expect(context.ranges).toEqual(['RANGE1', 'RANGE2']);
        expect(sortRangesSpy).toHaveBeenCalledWith(['RANGE1', 'RANGE2']);
    });

    it('searching, has existing ranges, has removed elements, no added elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        context.ranges = ['RANGE1', 'RANGE2'];
        getRangesByTextSpy.and.returnValue(['RANGE3', 'RANGE4']);

        const mockedRemovedElement = {
            contains: (r: any) => r == 'RANGE1',
        } as any;

        updateHighlight(mockedEditor, context, null, [mockedRemovedElement]);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith(['RANGE3', 'RANGE4']);
        expect(context.ranges).toEqual(['RANGE3', 'RANGE4']);
        expect(sortRangesSpy).toHaveBeenCalledWith(['RANGE3', 'RANGE4']);
    });

    it('searching, has existing ranges, has removed elements, has empty added elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        const range1 = {
            startContainer: 'RANGE1',
        } as any;
        const range2 = {
            startContainer: 'RANGE2',
        } as any;
        context.ranges = [range1, range2];
        getRangesByTextGlobalSpy.and.returnValue(['RANGE3', 'RANGE4']);

        const mockedRemovedElement = {
            contains: (r: any) => r == 'RANGE1',
        } as any;

        updateHighlight(mockedEditor, context, [], [mockedRemovedElement]);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith([range2]);
        expect(context.ranges).toEqual([range2]);
        expect(getRangesByTextGlobalSpy).not.toHaveBeenCalled();
        expect(sortRangesSpy).toHaveBeenCalledWith([range2]);
    });

    it('searching, has existing ranges, has removed elements, has added elements', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        const range1 = {
            startContainer: 'RANGE1',
        } as any;
        const range2 = {
            startContainer: 'RANGE2',
        } as any;
        context.ranges = [range1, range2];
        getRangesByTextGlobalSpy.and.returnValue(['RANGE3', 'RANGE4']);

        const mockedRemovedElement = {
            contains: (r: any) => r == 'RANGE1',
        } as any;

        const mockedAddedElement = 'ADDED_ELEMENT' as any;

        updateHighlight(mockedEditor, context, [mockedAddedElement], [mockedRemovedElement]);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).toHaveBeenCalledWith([range2, 'RANGE3', 'RANGE4']);
        expect(context.ranges).toEqual([range2, 'RANGE3', 'RANGE4']);
        expect(getRangesByTextGlobalSpy).toHaveBeenCalledWith(
            mockedAddedElement,
            'test',
            true,
            false,
            true
        );
        expect(sortRangesSpy).toHaveBeenCalledWith([range2, 'RANGE3', 'RANGE4']);
    });

    it('searching, no ranges found', () => {
        context.text = 'test';
        context.matchCase = true;
        context.wholeWord = false;
        getRangesByTextSpy.and.returnValue([]);

        updateHighlight(mockedEditor, context);

        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(context.findHighlight.clear).toHaveBeenCalled();
        expect(context.findHighlight.addRanges).not.toHaveBeenCalled();
        expect(context.ranges.length).toBe(0);
        expect(sortRangesSpy).toHaveBeenCalledWith([]);
    });
});
