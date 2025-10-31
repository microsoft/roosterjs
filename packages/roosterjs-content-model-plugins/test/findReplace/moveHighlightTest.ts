import * as setMarkedIndex from '../../lib/findReplace/utils/setMarkedIndex';
import { FindReplaceContext } from '../../lib/findReplace/types/FindReplaceContext';
import { IEditor } from 'roosterjs-content-model-types';
import { moveHighlight } from '../../lib/findReplace/moveHighlight';

describe('moveHighlight', () => {
    let mockedEditor: IEditor;
    let context: FindReplaceContext;
    let setMarkedIndexSpy: jasmine.Spy;

    beforeEach(() => {
        setMarkedIndexSpy = spyOn(setMarkedIndex, 'setMarkedIndex');
        mockedEditor = ('EDITOR' as any) as IEditor;
        context = {
            ranges: [],
            markedIndex: -1,
        } as any;
    });

    it('no ranges', () => {
        moveHighlight(mockedEditor, context, true);
        expect(setMarkedIndexSpy).not.toHaveBeenCalled();
    });

    it('move forward', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 0;
        moveHighlight(mockedEditor, context, true);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 1);
    });
    it('move backward', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 1;
        moveHighlight(mockedEditor, context, false);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0);
    });

    it('move backward from -1', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any, 'RANGE3' as any];
        context.markedIndex = -1;
        moveHighlight(mockedEditor, context, false);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 2);
    });

    it('move forward from -1', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any, 'RANGE3' as any];
        context.markedIndex = -1;
        moveHighlight(mockedEditor, context, true);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0);
    });

    it('move forward with wrap around', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 1;
        moveHighlight(mockedEditor, context, true);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 0);
    });

    it('move backward with wrap around', () => {
        context.ranges = ['RANGE1' as any, 'RANGE2' as any];
        context.markedIndex = 0;
        moveHighlight(mockedEditor, context, false);
        expect(setMarkedIndexSpy).toHaveBeenCalledWith(mockedEditor, context, 1);
    });
});
