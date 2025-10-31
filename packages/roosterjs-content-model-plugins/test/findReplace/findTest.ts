import * as updateHighlight from '../../lib/findReplace/utils/updateHighlight';
import { find } from '../../lib/findReplace/find';
import { FindReplaceContext } from '../../lib/findReplace/types/FindReplaceContext';
import { IEditor } from 'roosterjs-content-model-types';

describe('find', () => {
    let mockedEditor: IEditor;
    let context: FindReplaceContext;
    let updateHighlightSpy: jasmine.Spy;

    beforeEach(() => {
        context = ({} as any) as FindReplaceContext;
        mockedEditor = ('EDITOR' as any) as IEditor;
        updateHighlightSpy = spyOn(updateHighlight, 'updateHighlight');
    });

    it('start to find', () => {
        find(mockedEditor, context, 'test', false, true);

        expect(context.text).toBe('test');
        expect(context.matchCase).toBe(false);
        expect(context.wholeWord).toBe(true);
        expect(updateHighlightSpy).toHaveBeenCalledWith(mockedEditor, context);
    });

    it('stop to find', () => {
        find(mockedEditor, context, null);
        expect(context.text).toBeNull();
        expect(updateHighlightSpy).toHaveBeenCalledWith(mockedEditor, context);
    });
});
