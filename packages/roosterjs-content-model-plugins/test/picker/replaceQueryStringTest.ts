import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import * as mergeModel from 'roosterjs-content-model-dom/lib/modelApi/editing/mergeModel';
import { replaceQueryString } from '../../lib/picker/replaceQueryString';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelText,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

describe('replaceQueryString', () => {
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy;
    let editor: IEditor;
    let focusSpy: jasmine.Spy;
    let mergeModelSpy: jasmine.Spy;

    beforeEach(() => {
        focusSpy = jasmine.createSpy('focus');
        mergeModelSpy = spyOn(mergeModel, 'mergeModel');

        formatTextSegmentBeforeSelectionMarkerSpy = spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        );
        editor = {
            focus: focusSpy,
        } as any;
    });

    function runTest(
        target: ContentModelDocument,
        prev: ContentModelSegment,
        para: ContentModelParagraph,
        expectedCalledModel: ContentModelDocument | null
    ) {
        const context: FormatContentModelContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        };
        let callbackFunc: any;

        formatTextSegmentBeforeSelectionMarkerSpy.and.callFake(
            (editor: IEditor, callback: Function) => {
                callbackFunc = callback;
                const result = callback(target, prev, para, {}, context);

                expect(result).toBe(!!expectedCalledModel);

                return result;
            }
        );

        const mockedModel = 'MODEL' as any;
        const options = 'OPTIONS' as any;

        replaceQueryString(editor, '@', mockedModel, options, true);

        expect(focusSpy).toHaveBeenCalledWith();
        expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledWith(
            editor,
            callbackFunc,
            options
        );

        if (expectedCalledModel) {
            expect(context.canUndoByBackspace).toBe(true);
            expect(mergeModelSpy).toHaveBeenCalledWith(expectedCalledModel, mockedModel, context);
        } else {
            expect(context.canUndoByBackspace).toBeFalsy();
            expect(mergeModelSpy).not.toHaveBeenCalled();
        }
    }

    it('No trigger character', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const para: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [text],
        };
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [para],
        };
        runTest(doc, text, para, null);
    });

    it('Has trigger character', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'te@st',
            format: {},
        };
        const para: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [text],
        };
        const doc: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [para],
        };
        runTest(doc, text, para, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: '@st',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
