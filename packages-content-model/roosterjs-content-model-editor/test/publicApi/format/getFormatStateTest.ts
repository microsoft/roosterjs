import * as getPendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as retrieveModelFormatState from '../../../lib/modelApi/common/retrieveModelFormatState';
import getFormatState from '../../../lib/publicApi/format/getFormatState';
import { FormatState, SelectionRangeTypes } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    createContentModelDocument,
    createDomToModelContext,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
} from 'roosterjs-content-model-types';

const selectedNodeId = 'Selected';

describe('getFormatState', () => {
    beforeEach(() => {
        spyOn(retrieveModelFormatState, 'retrieveModelFormatState').and.callThrough();
    });

    function runTest(
        html: string,
        pendingFormat: ContentModelSegmentFormat | null,
        expectedModel: ContentModelDocument,
        expectedFormat: FormatState
    ) {
        const editor = ({
            getUndoState: () => ({
                canUndo: false,
                canRedo: false,
            }),
            isDarkMode: () => false,
            getZoomScale: () => 1,
            createContentModel: (options: DomToModelOption) => {
                const model = createContentModelDocument();
                const editorDiv = document.createElement('div');

                editorDiv.innerHTML = html;

                const selectedNode = editorDiv.querySelector('#' + selectedNodeId);
                const context = createDomToModelContext(undefined, {
                    ...(options || {}),
                });

                if (selectedNode) {
                    context.rangeEx = {
                        type: SelectionRangeTypes.Normal,
                        ranges: [
                            {
                                commonAncestorContainer: selectedNode,
                            } as any,
                        ],
                        areAllCollapsed: false,
                    };
                }

                context.elementProcessors.child(model, editorDiv, context);

                normalizeContentModel(model);

                return model;
            },
        } as any) as IContentModelEditor;

        spyOn(getPendingFormat, 'getPendingFormat').and.returnValue(pendingFormat);

        const result = getFormatState(editor);

        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledTimes(1);
        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledWith(
            expectedModel,
            pendingFormat,
            {
                canUndo: false,
                canRedo: false,
                isDarkMode: false,
                zoomScale: 1,
            }
        );
        expect(result).toEqual(expectedFormat);
    }

    it('Empty model', () => {
        runTest(
            '',
            null,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Single node', () => {
        runTest(
            `<span id=${selectedNodeId}>test</span>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Multiple node', () => {
        runTest(
            `<div>test1</div><span id=${selectedNodeId}>test2</span><div>test3</div>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Multiple node, has child under selection', () => {
        runTest(
            `<div>test1</div><div id=${selectedNodeId}><div>line1</div><div>line2</div></div><div>test3</div>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'line1',
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'line2',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });
});
