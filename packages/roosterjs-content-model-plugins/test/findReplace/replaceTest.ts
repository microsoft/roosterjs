import * as replaceTextInRange from '../../lib/findReplace/utils/replaceTextInRange';
import * as setMarkedIndex from '../../lib/findReplace/utils/setMarkedIndex';
import { FindReplaceContext } from '../../lib/findReplace/types/FindReplaceContext';
import { IEditor } from 'roosterjs-content-model-types';
import { replace } from '../../lib/findReplace/replace';

describe('replace', () => {
    let mockedEditor: IEditor;
    let context: FindReplaceContext;
    let clearSpy: jasmine.Spy;
    let addRangesSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let replaceTextInRangeSpy: jasmine.Spy;
    let setMarkedIndexSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;

    beforeEach(() => {
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        replaceTextInRangeSpy = spyOn(replaceTextInRange, 'replaceTextInRange');
        setMarkedIndexSpy = spyOn(setMarkedIndex, 'setMarkedIndex');
        triggerEventSpy = jasmine.createSpy('triggerEvent');

        mockedEditor = ({
            takeSnapshot: takeSnapshotSpy,
            getDOMHelper: () => ({
                isNodeInEditor: () => true,
            }),
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        clearSpy = jasmine.createSpy('clear');
        addRangesSpy = jasmine.createSpy('addRanges');

        context = {
            ranges: [],
            markedIndex: -1,
            findHighlight: {
                clear: clearSpy,
                addRanges: addRangesSpy,
            },
        } as any;
    });

    it('no search text', () => {
        context.text = '';
        replace(mockedEditor, context, 'REPLACE_TEXT', false);

        expect(setMarkedIndexSpy).toHaveBeenCalledTimes(1);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, -1);
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(replaceTextInRangeSpy).not.toHaveBeenCalled();
        expect(clearSpy).not.toHaveBeenCalled();
        expect(addRangesSpy).not.toHaveBeenCalled();
        expect(triggerEventSpy).not.toHaveBeenCalled();
    });

    it('no ranges', () => {
        context.text = 'SEARCH_TEXT';
        context.ranges = [];
        replace(mockedEditor, context, 'REPLACE_TEXT', false);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(replaceTextInRangeSpy).not.toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).not.toHaveBeenCalled();
        expect(triggerEventSpy).not.toHaveBeenCalled();
    });

    it('initial replace', () => {
        context.text = 'SEARCH_TEXT';
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = -1;

        replace(mockedEditor, context, 'REPLACE_TEXT', false);

        expect(replaceTextInRangeSpy).not.toHaveBeenCalled();
        expect(setMarkedIndexSpy).toHaveBeenCalledTimes(1);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).toHaveBeenCalledWith(['RANGE1' as any, 'RANGE2' as any]);
        expect(triggerEventSpy).not.toHaveBeenCalled();
    });

    it('replace once', () => {
        context.text = 'SEARCH_TEXT';
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 0;

        replace(mockedEditor, context, 'REPLACE_TEXT', false);

        expect(replaceTextInRangeSpy).toHaveBeenCalledWith(
            'RANGE1' as any,
            'REPLACE_TEXT',
            context.ranges
        );
        expect(setMarkedIndexSpy).toHaveBeenCalledTimes(1);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(
            mockedEditor,
            context,
            0,
            replaceTextInRangeSpy.calls.mostRecent().returnValue
        );
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).toHaveBeenCalledWith(['RANGE2' as any]);
        expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
            data: 'REPLACE_TEXT',
            source: 'Replace',
        });
    });

    it('replace next', () => {
        context.text = 'SEARCH_TEXT';
        context.ranges = ['RANGE1' as any, 'RANGE2' as any, 'RANGE3' as any];
        context.markedIndex = 1;
        replace(mockedEditor, context, 'REPLACE_TEXT', false);
        expect(replaceTextInRangeSpy).toHaveBeenCalledWith(
            'RANGE2' as any,
            'REPLACE_TEXT',
            context.ranges
        );
        expect(setMarkedIndexSpy).toHaveBeenCalledTimes(1);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(
            mockedEditor,
            context,
            1,
            replaceTextInRangeSpy.calls.mostRecent().returnValue
        );
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).toHaveBeenCalledWith(['RANGE1' as any, 'RANGE3' as any]);
        expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
            data: 'REPLACE_TEXT',
            source: 'Replace',
        });
    });

    it('replace all', () => {
        context.text = 'SEARCH_TEXT';
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 0;

        replaceTextInRangeSpy.and.callFake((range: any) => {
            return range == 'RANGE2' ? 'NEW_RANGE2' : undefined;
        });

        replace(mockedEditor, context, 'REPLACE_TEXT', true);

        expect(replaceTextInRangeSpy).toHaveBeenCalledTimes(2);
        expect(replaceTextInRangeSpy.calls.argsFor(0)).toEqual([
            'RANGE1' as any,
            'REPLACE_TEXT',
            context.ranges,
        ]);
        expect(replaceTextInRangeSpy.calls.argsFor(1)).toEqual([
            'RANGE2' as any,
            'REPLACE_TEXT',
            context.ranges,
        ]);

        expect(setMarkedIndexSpy).toHaveBeenCalledTimes(2);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0, undefined);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0, 'NEW_RANGE2');
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(clearSpy).toHaveBeenCalled();
        expect(addRangesSpy).not.toHaveBeenCalled();
        expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
            data: 'REPLACE_TEXT',
            source: 'Replace',
        });
    });
});
