import * as createHighlightHelperModule from '../../lib/findReplace/utils/HighlightHelperImpl';
import { createFindReplaceContext } from '../../lib/findReplace/createFindReplaceContext';

describe('createFindReplaceContext', () => {
    beforeEach(() => {
        spyOn(createHighlightHelperModule, 'createHighlightHelper').and.callFake(
            (styleKey: string) => styleKey as any
        );
    });

    it('creates context with default values', () => {
        const context = createFindReplaceContext();
        expect(context).toEqual({
            text: null,
            matchCase: false,
            wholeWord: false,
            ranges: [],
            markedIndex: -1,
            scrollMargin: 20,
            findHighlight: 'roostersFindHighlight' as any,
            replaceHighlight: 'roostersReplaceHighlight' as any,
        });
    });

    it('creates context with custom scroll margin', () => {
        const scrollMargin = 0;
        const context = createFindReplaceContext(scrollMargin);
        expect(context).toEqual({
            text: null,
            matchCase: false,
            wholeWord: false,
            ranges: [],
            markedIndex: -1,
            scrollMargin: 0,
            findHighlight: 'roostersFindHighlight' as any,
            replaceHighlight: 'roostersReplaceHighlight' as any,
        });
    });
});
